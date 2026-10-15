import { NextRequest, NextResponse } from 'next/server'

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID!
const CLIENT_EMAIL = process.env.GA_SERVICE_ACCOUNT_EMAIL!
const PRIVATE_KEY = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')!

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
    throw new Error(`Token error: ${JSON.stringify(tokenData)}`)
  }
  return tokenData.access_token
}

// ─── GA4 Data API helper ──────────────────────────────────────────────────────

async function runReport(
  token: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  metrics: string[],
  orderByMetric?: string,
  limit = 20
) {
  const body: any = {
    dateRanges: [{ startDate, endDate }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit,
  }
  if (orderByMetric) {
    body.orderBys = [{ metric: { metricName: orderByMetric }, desc: true }]
  }

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  return res.json()
}

async function runRealtimeReport(token: string) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY_ID}:runRealtimeReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics: [{ name: 'activeUsers' }],
      }),
    }
  )
  return res.json()
}

// ─── Parse rows ───────────────────────────────────────────────────────────────

function parseRows(report: any) {
  return (report?.rows ?? []).map((row: any) => ({
    dimensions: row.dimensionValues?.map((d: any) => d.value) ?? [],
    metrics: row.metricValues?.map((m: any) => m.value) ?? [],
  }))
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'

    const token = await getAccessToken()

    const [
      overviewReport,
      realtimeReport,
      pagesReport,
      sourcesReport,
      devicesReport,
      osReport,
      countriesReport,
      citiesReport,
      languagesReport,
      keywordsReport,
      ageReport,
    ] = await Promise.all([
      runReport(token, startDate, endDate, [], ['sessions', 'activeUsers', 'screenPageViews', 'averageSessionDuration', 'bounceRate', 'newUsers']),
      runRealtimeReport(token),
      runReport(token, startDate, endDate, ['pagePath', 'pageTitle'], ['screenPageViews', 'activeUsers'], 'screenPageViews', 20),
      runReport(token, startDate, endDate, ['sessionDefaultChannelGroup', 'sessionSource'], ['sessions', 'activeUsers'], 'sessions', 20),
      runReport(token, startDate, endDate, ['deviceCategory'], ['sessions', 'activeUsers'], 'sessions', 10),
      runReport(token, startDate, endDate, ['operatingSystem'], ['sessions', 'activeUsers'], 'sessions', 10),
      runReport(token, startDate, endDate, ['country'], ['sessions', 'activeUsers'], 'sessions', 20),
      runReport(token, startDate, endDate, ['city', 'country'], ['sessions', 'activeUsers'], 'sessions', 20),
      runReport(token, startDate, endDate, ['language'], ['sessions', 'activeUsers'], 'sessions', 20),
      runReport(token, startDate, endDate, ['sessionGoogleAdsKeyword'], ['sessions'], 'sessions', 20),
      runReport(token, startDate, endDate, ['userAgeBracket'], ['activeUsers'], 'activeUsers', 10),
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
  } catch (error: any) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Analytics data fetch failed' },
      { status: 500 }
    )
  }
}
