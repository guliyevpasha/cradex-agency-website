/**
 * Sample campaign and SEO cases for the "Our work" pages. They are shown with
 * a "Sample" badge until real cases are added in the CMS. Every key points into
 * `site.workSamples` (types, sectors, metrics) and the sentence for each case
 * is `site.workSamples.ads[i]` / `.seo[i]` in the same order as these lists.
 * @author Paşa Quliyev — Cradex Agency
 */

export type AdSample = {
  platform: 'meta' | 'tiktok' | 'google' | 'linkedin'
  type: string
  sector: string
  days: number
  metrics: [string, string][]
  bars: number[]
}

export type SeoSample = {
  type: string
  sector: string
  months: number
  metrics: [string, string][]
  line: number[]
}

// 15 per platform, in the order meta, tiktok, google, linkedin. The third metric is the headline KPI.
export const AD_SAMPLES: AdSample[] = [
  { platform: 'meta', type: 'metaLeadForms', sector: 'clinic', days: 30, metrics: [['spend', '$600'], ['leads', '480'], ['cpl', '$1.25']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaAdvantageShopping', sector: 'fashion', days: 45, metrics: [['spend', '$1 200'], ['orders', '212'], ['roas', '4.2×']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaCatalogRetargeting', sector: 'electronics', days: 30, metrics: [['spend', '$450'], ['orders', '96'], ['roas', '6.1×']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaClickToMessage', sector: 'beautySalon', days: 21, metrics: [['spend', '$240'], ['messages', '620'], ['costPerMessage', '$0.39']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaTraffic', sector: 'hotel', days: 30, metrics: [['spend', '$300'], ['clicks', '6 000'], ['cpc', '$0.05']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaReach', sector: 'event', days: 14, metrics: [['spend', '$500'], ['reach', '280 000'], ['cpm', '$0.95']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaThruPlay', sector: 'cafe', days: 21, metrics: [['spend', '$200'], ['views', '20 000'], ['costPerThruPlay', '$0.01']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'meta', type: 'metaEngagement', sector: 'cosmetics', days: 14, metrics: [['spend', '$150'], ['engagements', '11 500'], ['costPerEngagement', '$0.013']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'meta', type: 'metaAppInstall', sector: 'mobileApp', days: 30, metrics: [['spend', '$900'], ['installs', '1 500'], ['cpi', '$0.60']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaConversions', sector: 'furniture', days: 60, metrics: [['spend', '$2 000'], ['orders', '148'], ['cpa', '$13.51']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaLookalike', sector: 'fintech', days: 45, metrics: [['spend', '$1 500'], ['leads', '620'], ['cpl', '$2.42']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaLocalStore', sector: 'pharmacy', days: 30, metrics: [['spend', '$350'], ['storeVisits', '1 150'], ['costPerVisit', '$0.30']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaReels', sector: 'kidsStore', days: 30, metrics: [['spend', '$400'], ['views', '310 000'], ['cpm', '$1.05']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaCollection', sector: 'jewelry', days: 30, metrics: [['spend', '$700'], ['orders', '84'], ['roas', '3.8×']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaVideoRetarget', sector: 'university', days: 30, metrics: [['spend', '$420'], ['leads', '165'], ['cpl', '$2.55']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokSpark', sector: 'fashion', days: 21, metrics: [['spend', '$300'], ['views', '240 000'], ['cpm', '$0.63']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'restaurant', days: 14, metrics: [['spend', '$180'], ['clicks', '3 600'], ['cpc', '$0.05']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokReachFreq', sector: 'carDealer', days: 14, metrics: [['spend', '$600'], ['reach', '520 000'], ['cpm', '$0.52']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokVideoViews', sector: 'travel', days: 21, metrics: [['spend', '$250'], ['views', '410 000'], ['cpm', '$0.40']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'tiktok', type: 'tiktokLeadGen', sector: 'eduCenter', days: 30, metrics: [['spend', '$400'], ['leads', '310'], ['cpl', '$1.29']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'tiktok', type: 'tiktokConversions', sector: 'cosmetics', days: 45, metrics: [['spend', '$900'], ['orders', '260'], ['roas', '5.8×']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'tiktok', type: 'tiktokAppInstall', sector: 'mobileApp', days: 30, metrics: [['spend', '$700'], ['installs', '2 800'], ['cpi', '$0.25']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'tiktok', type: 'tiktokCatalog', sector: 'kidsStore', days: 30, metrics: [['spend', '$500'], ['orders', '95'], ['roas', '3.9×']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokCommunity', sector: 'beautySalon', days: 30, metrics: [['spend', '$200'], ['followers', '4 100'], ['costPerFollower', '$0.05']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'tiktok', type: 'tiktokSmartPlus', sector: 'electronics', days: 30, metrics: [['spend', '$800'], ['orders', '41'], ['roas', '4.6×']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokRetarget', sector: 'jewelry', days: 21, metrics: [['spend', '$250'], ['orders', '52'], ['cpa', '$4.81']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokLaunch', sector: 'cafe', days: 14, metrics: [['spend', '$350'], ['reach', '390 000'], ['cpm', '$0.48']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'autoService', days: 21, metrics: [['spend', '$220'], ['messages', '340'], ['costPerMessage', '$0.65']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'tiktok', type: 'tiktokLive', sector: 'furniture', days: 14, metrics: [['spend', '$260'], ['liveViewers', '18 500'], ['costPerViewer', '$0.014']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'tiktok', type: 'tiktokUgc', sector: 'fitness', days: 30, metrics: [['spend', '$280'], ['clicks', '7 000'], ['cpc', '$0.04']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'google', type: 'googleSearchLeads', sector: 'dentist', days: 30, metrics: [['spend', '$450'], ['leads', '112'], ['cpl', '$4.02']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'google', type: 'googleSearchCalls', sector: 'autoService', days: 30, metrics: [['spend', '$300'], ['calls', '86'], ['costPerCall', '$3.49']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'google', type: 'googlePmax', sector: 'cosmetics', days: 45, metrics: [['spend', '$1 500'], ['orders', '420'], ['roas', '7.2×']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'google', type: 'googleShopping', sector: 'electronics', days: 30, metrics: [['spend', '$900'], ['clicks', '5 300'], ['cpc', '$0.17']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'google', type: 'googleDisplayRemarketing', sector: 'travel', days: 30, metrics: [['spend', '$250'], ['leads', '96'], ['cpl', '$2.60']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'google', type: 'googleYoutubeInStream', sector: 'university', days: 30, metrics: [['spend', '$400'], ['views', '52 000'], ['cpv', '$0.008']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'google', type: 'googleShorts', sector: 'fitness', days: 21, metrics: [['spend', '$200'], ['views', '100 000'], ['cpv', '$0.002']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'google', type: 'googleDemandGen', sector: 'realEstate', days: 45, metrics: [['spend', '$1 100'], ['leads', '138'], ['cpl', '$7.97']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'google', type: 'googleLocalPmax', sector: 'pharmacy', days: 30, metrics: [['spend', '$380'], ['storeVisits', '1 900'], ['costPerVisit', '$0.20']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'google', type: 'googleApp', sector: 'mobileApp', days: 30, metrics: [['spend', '$1 000'], ['installs', '1 900'], ['cpi', '$0.53']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'google', type: 'googleBrandSearch', sector: 'fintech', days: 30, metrics: [['spend', '$150'], ['clicks', '2 400'], ['cpc', '$0.06']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'google', type: 'googleDsa', sector: 'carDealer', days: 30, metrics: [['spend', '$500'], ['clicks', '1 900'], ['cpc', '$0.26']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'google', type: 'googleBumper', sector: 'event', days: 14, metrics: [['spend', '$350'], ['reach', '420 000'], ['cpm', '$0.60']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'google', type: 'googleLeadFormAsset', sector: 'insurance', days: 30, metrics: [['spend', '$400'], ['leads', '88'], ['cpl', '$4.55']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'google', type: 'googleCompetitor', sector: 'logistics', days: 30, metrics: [['spend', '$600'], ['leads', '90'], ['cpl', '$6.67']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'linkedin', type: 'linkedinLeadGen', sector: 'saas', days: 30, metrics: [['spend', '$1 200'], ['leads', '44'], ['cpl', '$27.27']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'linkedin', type: 'linkedinTraffic', sector: 'manufacturing', days: 21, metrics: [['spend', '$600'], ['clicks', '150'], ['cpc', '$4.00']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'linkedin', type: 'linkedinDocument', sector: 'lawFirm', days: 30, metrics: [['spend', '$800'], ['leads', '38'], ['cpl', '$21.05']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'linkedin', type: 'linkedinConversation', sector: 'logistics', days: 30, metrics: [['spend', '$900'], ['replies', '46'], ['costPerReply', '$19.57']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'linkedin', type: 'linkedinVideo', sector: 'construction', days: 30, metrics: [['spend', '$500'], ['views', '38 000'], ['cpv', '$0.013']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'linkedin', type: 'linkedinThoughtLeader', sector: 'saas', days: 30, metrics: [['spend', '$700'], ['engagements', '2 900'], ['costPerEngagement', '$0.24']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'linkedin', type: 'linkedinText', sector: 'manufacturing', days: 21, metrics: [['spend', '$300'], ['clicks', '85'], ['cpc', '$3.53']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'linkedin', type: 'linkedinFollowers', sector: 'lawFirm', days: 30, metrics: [['spend', '$350'], ['followers', '420'], ['costPerFollower', '$0.83']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'linkedin', type: 'linkedinEvent', sector: 'eduCenter', days: 21, metrics: [['spend', '$900'], ['registrations', '64'], ['costPerRegistration', '$14.06']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'linkedin', type: 'linkedinJobs', sector: 'recruitment', days: 30, metrics: [['spend', '$650'], ['applications', '72'], ['costPerApplication', '$9.03']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'linkedin', type: 'linkedinCarousel', sector: 'construction', days: 30, metrics: [['spend', '$550'], ['clicks', '170'], ['cpc', '$3.24']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'linkedin', type: 'linkedinConversions', sector: 'saas', days: 45, metrics: [['spend', '$1 500'], ['demoRequests', '52'], ['costPerDemo', '$28.85']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'linkedin', type: 'linkedinAbm', sector: 'manufacturing', days: 90, metrics: [['spend', '$2 000'], ['meetings', '11'], ['costPerMeeting', '$181.82']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'linkedin', type: 'linkedinRetarget', sector: 'logistics', days: 30, metrics: [['spend', '$400'], ['leads', '24'], ['cpl', '$16.67']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'linkedin', type: 'linkedinAwareness', sector: 'insurance', days: 30, metrics: [['spend', '$700'], ['reach', '36 000'], ['cpm', '$17.50']], bars: [62, 70, 58, 77, 85, 92, 100] },
]

export const SEO_SAMPLES: SeoSample[] = [
  { type: 'seoLocal', sector: 'dentist', months: 6, metrics: [['organicTraffic', '+184%'], ['keywordsTop3', '27'], ['leadsPerMonth', '36']], line: [12, 24, 41, 58, 79, 100] },
  { type: 'seoTechnical', sector: 'realEstate', months: 4, metrics: [['crawlErrors', '-92%'], ['organicTraffic', '+67%'], ['indexedPages', '+3 400']], line: [8, 19, 35, 52, 74, 96] },
  { type: 'seoEcomCategory', sector: 'furniture', months: 8, metrics: [['organicTraffic', '+212%'], ['keywordsTop10', '186'], ['organicOrders', '74']], line: [15, 22, 38, 61, 83, 100] },
  { type: 'seoMaps', sector: 'restaurant', months: 3, metrics: [['mapViews', '18 400'], ['calls', '310'], ['routeRequests', '1 150']], line: [10, 28, 36, 55, 71, 94] },
  { type: 'seoGeo', sector: 'lawFirm', months: 5, metrics: [['aiMentions', '23'], ['aiTraffic', '+310%'], ['leadsPerMonth', '14']], line: [6, 17, 33, 49, 76, 100] },
  { type: 'seoContentHub', sector: 'insurance', months: 9, metrics: [['articles', '64'], ['organicTraffic', '+156%'], ['leadsPerMonth', '52']], line: [12, 24, 41, 58, 79, 100] },
  { type: 'seoMultilingual', sector: 'hotel', months: 6, metrics: [['languages', '4'], ['organicTraffic', '+238%'], ['bookingsPerMonth', '41']], line: [8, 19, 35, 52, 74, 96] },
  { type: 'seoMigration', sector: 'carDealer', months: 2, metrics: [['redirects', '1 240'], ['trafficKept', '98%'], ['rankingsKept', '96%']], line: [15, 22, 38, 61, 83, 100] },
  { type: 'seoInternational', sector: 'travel', months: 8, metrics: [['markets', '2'], ['foreignTraffic', '+320%'], ['leadsPerMonth', '58']], line: [10, 28, 36, 55, 71, 94] },
  { type: 'seoEeat', sector: 'clinic', months: 7, metrics: [['pagesUpdated', '38'], ['keywordsTop10', '94'], ['organicTraffic', '+142%']], line: [6, 17, 33, 49, 76, 100] },
  { type: 'seoLinkBuilding', sector: 'construction', months: 6, metrics: [['backlinks', '48'], ['domainRating', '+14'], ['keywordsTop10', '63']], line: [12, 24, 41, 58, 79, 100] },
  { type: 'seoCwv', sector: 'fashion', months: 3, metrics: [['lcp', '1.6 s'], ['perfScore', '94'], ['conversionRate', '+27%']], line: [8, 19, 35, 52, 74, 96] },
  { type: 'seoSchema', sector: 'beautySalon', months: 4, metrics: [['richResults', '36'], ['ctr', '+41%'], ['organicClicks', '+58%']], line: [15, 22, 38, 61, 83, 100] },
  { type: 'seoYoutube', sector: 'languageSchool', months: 6, metrics: [['videoViews', '84 000'], ['subscribers', '2 300'], ['leadsPerMonth', '29']], line: [10, 28, 36, 55, 71, 94] },
  { type: 'seoMultiBranch', sector: 'pharmacy', months: 5, metrics: [['branches', '12'], ['mapViews', '96 000'], ['callsPerMonth', '740']], line: [6, 17, 33, 49, 76, 100] },
]
