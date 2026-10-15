import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextRequest, NextResponse } from 'next/server'

const propertyId = process.env.GA_PROPERTY_ID!
const clientEmail = process.env.GA_SERVICE_ACCOUNT_EMAIL!
const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')!

function getClient() {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || '30daysAgo'
    const endDate = searchParams.get('endDate') || 'today'

    const analyticsDataClient = getClient()

    // Run all reports in parallel
    const [
      overviewResponse,
      realtimeResponse,
      pagesResponse,
      sourcesResponse,
      devicesResponse,
      osResponse,
      countriesResponse,
      citiesResponse,
      languagesResponse,
      keywordsResponse,
      ageResponse,
    ] = await Promise.all([
      // 1. Overview: sessions, users, pageviews
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'newUsers' },
        ],
      }),

      // 2. Realtime active users
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),

      // 3. Top pages
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20,
      }),

      // 4. Traffic sources (channel grouping + source/medium)
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }, { name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),

      // 5. Devices
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),

      // 6. Operating systems
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'operatingSystem' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 7. Countries
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),

      // 8. Cities
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'city' }, { name: 'country' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),

      // 9. Languages
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'language' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),

      // 10. Search keywords (organic)
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'sessionGoogleAdsKeyword' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      }),

      // 11. Age demographics
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'userAgeBracket' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),
    ])

    // Parse helpers
    const parseRows = (response: any) =>
      (response[0]?.rows ?? []).map((row: any) => ({
        dimensions: row.dimensionValues?.map((d: any) => d.value) ?? [],
        metrics: row.metricValues?.map((m: any) => m.value) ?? [],
      }))

    const overview = overviewResponse[0]?.rows?.[0]
    const realtimeUsers = realtimeResponse[0]?.rows?.[0]?.metricValues?.[0]?.value ?? '0'

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
      pages: parseRows(pagesResponse),
      sources: parseRows(sourcesResponse),
      devices: parseRows(devicesResponse),
      os: parseRows(osResponse),
      countries: parseRows(countriesResponse),
      cities: parseRows(citiesResponse),
      languages: parseRows(languagesResponse),
      keywords: parseRows(keywordsResponse),
      age: parseRows(ageResponse),
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
