/**
 * GA4 reports for the Studio analytics dashboard.
 * @author Paşa Quliyev — Cradex Agency
 */
import { NextRequest, NextResponse } from 'next/server'
import { isStudioUser } from '@/lib/server/studioAuth'

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID ?? ''
const CLIENT_EMAIL = process.env.GA_SERVICE_ACCOUNT_EMAIL ?? ''
const PRIVATE_KEY = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? ''

// ─── JWT for Google OAuth2 ────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const headerB64 = encode(header)
  const payloadB64 = encode(payload)
  const signingInput = `${headerB64}.${payloadB64}`

  // Import private key
  const keyData = PRIVATE_KEY
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const jwt = `${signingInput}.${sigB64}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) {
    throw new Error(`Google token request failed (${tokenRes.status})`)
  }
  return tokenData.access_token
}

// Google answers a refused report with an error body. Passing that on as an
// empty report is how the dashboard showed zeros for days without a word.
class GaError extends Error {
  constructor(public status: number, public reason: string) {
    super(`GA4 ${status} ${reason}`)
  }
}

async function checked(res: Response) {
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.error) throw new GaError(res.status, json?.error?.status ?? 'UNKNOWN')
  return json
}

// ─── GA4 Data API helper ──────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// GA4 caps concurrent requests per property; eleven parallel calls got 429/502
// back and one refusal failed the whole dashboard. One retry covers the rest.
async function gaPost(token: string, method: string, body: object) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:${method}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    if (attempt < 2 && (res.status === 429 || res.status >= 500)) {
      await sleep(800 * (attempt + 1))
      continue
    }
    return checked(res)
  }
}

type ReportSpec = { dimensions: string[]; metrics: string[]; orderBy?: string; limit?: number }

const report = (dimensions: string[], metrics: string[], orderBy?: string, limit = 20): ReportSpec =>
  ({ dimensions, metrics, orderBy, limit })

// batchRunReports takes up to 5 reports in one request
async function runBatch(token: string, startDate: string, endDate: string, specs: ReportSpec[]) {
  const requests = specs.map((s) => ({
    dateRanges: [{ startDate, endDate }],
    dimensions: s.dimensions.map((name) => ({ name })),
    metrics: s.metrics.map((name) => ({ name })),
    limit: s.limit,
    ...(s.orderBy ? { orderBys: [{ metric: { metricName: s.orderBy }, desc: true }] } : {}),
  }))
  const json = await gaPost(token, 'batchRunReports', { requests })
  return (json?.reports ?? []) as any[]
}

function runRealtimeReport(token: string) {
  return gaPost(token, 'runRealtimeReport', { metrics: [{ name: 'activeUsers' }] })
}

// ─── Parse rows ───────────────────────────────────────────────────────────────

function parseRows(report: any) {
  return (report?.rows ?? []).map((row: any) => ({
    dimensions: row.dimensionValues?.map((d: any) => d.value) ?? [],
    metrics: row.metricValues?.map((m: any) => m.value) ?? [],
  }))
}

// ─── Route handler ────────────────────────────────────────────────────────────

// GA4 accepts YYYY-MM-DD, NdaysAgo, today and yesterday. Nothing else is forwarded.
const DATE_RE = /^(\d{4}-\d{2}-\d{2}|\d{1,4}daysAgo|today|yesterday)$/

export async function GET(request: NextRequest) {
  if (!GA_PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    return NextResponse.json({ error: 'Analytics is not configured' }, { status: 503 })
  }
  if (!(await isStudioUser(request.headers.get('authorization')))) {
    return NextResponse.json({ error: 'Unauthorized', code: 'login' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'
    if (!DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
    }

    const token = await getAccessToken()

    // 4 requests instead of 11; the optional pair sits in its own batch so a
    // refusal there (no Ads link, no demographics) does not sink the rest
    const [
      [overviewReport, pagesReport, sourcesReport, devicesReport, osReport],
      [countriesReport, citiesReport, languagesReport],
      [keywordsReport, ageReport],
      realtimeReport,
    ] = await Promise.all([
      runBatch(token, startDate, endDate, [
        report([], ['sessions', 'activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate', 'newUsers']),
        report(['pagePath', 'pageTitle'], ['screenPageViews', 'activeUsers'], 'screenPageViews'),
        report(['sessionDefaultChannelGroup', 'sessionSource'], ['sessions', 'activeUsers'], 'sessions'),
        report(['deviceCategory'], ['sessions', 'activeUsers'], 'sessions', 10),
        report(['operatingSystem'], ['sessions', 'activeUsers'], 'sessions', 10),
      ]),
      runBatch(token, startDate, endDate, [
        report(['country'], ['sessions', 'activeUsers'], 'sessions'),
        report(['city', 'country'], ['sessions', 'activeUsers'], 'sessions'),
        report(['language'], ['sessions', 'activeUsers'], 'sessions'),
      ]),
      runBatch(token, startDate, endDate, [
        report(['sessionGoogleAdsKeyword'], ['sessions'], 'sessions'),
        report(['userAgeBracket'], ['activeUsers'], 'activeUsers', 10),
      ]).catch(() => [null, null]),
      runRealtimeReport(token).catch(() => null),
    ])

    const overview = overviewReport?.rows?.[0]
    const realtimeUsers = realtimeReport?.rows?.[0]?.metricValues?.[0]?.value ?? '0'

    return NextResponse.json({
      overview: {
        sessions: overview?.metricValues?.[0]?.value ?? '0',
        activeUsers: overview?.metricValues?.[1]?.value ?? '0',
        pageViews: overview?.metricValues?.[2]?.value ?? '0',
        avgSessionDuration: overview?.metricValues?.[3]?.value ?? '0',
        bounceRate: overview?.metricValues?.[4]?.value ?? '0',
        newUsers: overview?.metricValues?.[5]?.value ?? '0',
        realtimeUsers,
      },
      pages: parseRows(pagesReport),
      sources: parseRows(sourcesReport),
      devices: parseRows(devicesReport),
      os: parseRows(osReport),
      countries: parseRows(countriesReport),
      cities: parseRows(citiesReport),
      languages: parseRows(languagesReport),
      keywords: parseRows(keywordsReport),
      age: parseRows(ageReport),
      dateRange: { startDate, endDate },
    })
  } catch (error) {
    console.error('[analytics] failed:', error instanceof Error ? error.message : error)
    if (error instanceof GaError && error.status === 403) {
      // the service account is not a user of the GA4 property (or the Data API is off)
      return NextResponse.json({ error: 'Analytics access denied', code: 'ga_forbidden', account: CLIENT_EMAIL, property: GA_PROPERTY_ID }, { status: 502 })
    }
    if (error instanceof GaError && (error.status === 429 || error.status >= 500)) {
      return NextResponse.json({ error: 'Google Analytics is not answering', code: 'ga_busy' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Analytics data fetch failed', code: 'ga_failed' }, { status: 502 })
  }
}
