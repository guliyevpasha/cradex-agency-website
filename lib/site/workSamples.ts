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
  months: number
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

// 15 per platform in the order meta, tiktok, google, linkedin, then the later Meta and TikTok additions. The third metric is the headline KPI.
export const AD_SAMPLES: AdSample[] = [
  { platform: 'meta', type: 'metaLeadForms', sector: 'aestheticClinic', months: 3, metrics: [['spend', '$1 800'], ['leads', '1 520'], ['cpl', '$1.18']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaAdvantageShopping', sector: 'fashion', months: 6, metrics: [['spend', '$4 800'], ['orders', '942'], ['roas', '4.2×']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaCatalogRetargeting', sector: 'electronics', months: 4, metrics: [['spend', '$1 800'], ['orders', '404'], ['roas', '6.1×']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'beautySalon', months: 9, metrics: [['spend', '$3 100'], ['messages', '8 860'], ['costPerMessage', '$0.35']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaTraffic', sector: 'hotel', months: 3, metrics: [['spend', '$900'], ['clicks', '18 900'], ['cpc', '$0.048']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaReach', sector: 'event', months: 5, metrics: [['spend', '$5 350'], ['reach', '917 000'], ['cpm', '$0.90']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaThruPlay', sector: 'cafe', months: 12, metrics: [['spend', '$3 450'], ['views', '381 000'], ['costPerThruPlay', '$0.009']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'meta', type: 'metaEngagement', sector: 'cosmetics', months: 4, metrics: [['spend', '$1 300'], ['engagements', '104 000'], ['costPerEngagement', '$0.013']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'meta', type: 'metaAppInstall', sector: 'mobileApp', months: 6, metrics: [['spend', '$5 400'], ['installs', '10 000'], ['cpi', '$0.54']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaConversions', sector: 'furniture', months: 3, metrics: [['spend', '$3 000'], ['orders', '234'], ['cpa', '$12.82']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaLookalike', sector: 'fintech', months: 8, metrics: [['spend', '$8 000'], ['leads', '3 670'], ['cpl', '$2.18']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaLocalStore', sector: 'pharmacy', months: 4, metrics: [['spend', '$1 400'], ['storeVisits', '4 840'], ['costPerVisit', '$0.29']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaReels', sector: 'kidsStore', months: 6, metrics: [['spend', '$2 400'], ['views', '2 070 000'], ['cpm', '$0.95']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaCollection', sector: 'jewelry', months: 3, metrics: [['spend', '$2 100'], ['orders', '265'], ['roas', '3.8×']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaVideoRetarget', sector: 'university', months: 5, metrics: [['spend', '$2 100'], ['leads', '868'], ['cpl', '$2.42']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokSpark', sector: 'fashion', months: 6, metrics: [['spend', '$2 550'], ['views', '2 290 000'], ['cpm', '$0.57']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'restaurant', months: 3, metrics: [['spend', '$1 150'], ['clicks', '24 400'], ['cpc', '$0.047']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokReachFreq', sector: 'carDealer', months: 4, metrics: [['spend', '$5 150'], ['reach', '1 200 000'], ['cpm', '$0.49']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokVideoViews', sector: 'travel', months: 12, metrics: [['spend', '$4 300'], ['views', '7 810 000'], ['cpm', '$0.36']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'tiktok', type: 'tiktokLeadGen', sector: 'eduCenter', months: 5, metrics: [['spend', '$2 000'], ['leads', '1 630'], ['cpl', '$1.23']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'tiktok', type: 'tiktokConversions', sector: 'cosmetics', months: 3, metrics: [['spend', '$1 800'], ['orders', '547'], ['roas', '5.8×']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'tiktok', type: 'tiktokAppInstall', sector: 'mobileApp', months: 6, metrics: [['spend', '$4 200'], ['installs', '18 700'], ['cpi', '$0.22']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'tiktok', type: 'tiktokCatalog', sector: 'kidsStore', months: 9, metrics: [['spend', '$4 500'], ['orders', '950'], ['roas', '3.9×']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokCommunity', sector: 'beautySalon', months: 4, metrics: [['spend', '$800'], ['followers', '17 300'], ['costPerFollower', '$0.046']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'tiktok', type: 'tiktokSmartPlus', sector: 'electronics', months: 3, metrics: [['spend', '$2 400'], ['orders', '129'], ['roas', '4.6×']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokRetarget', sector: 'jewelry', months: 6, metrics: [['spend', '$2 150'], ['orders', '495'], ['cpa', '$4.34']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokLaunch', sector: 'cafe', months: 4, metrics: [['spend', '$3 000'], ['reach', '1 140 000'], ['cpm', '$0.46']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'autoService', months: 9, metrics: [['spend', '$2 850'], ['messages', '4 860'], ['costPerMessage', '$0.59']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'tiktok', type: 'tiktokLive', sector: 'furniture', months: 3, metrics: [['spend', '$1 650'], ['liveViewers', '125 000'], ['costPerViewer', '$0.013']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'tiktok', type: 'tiktokUgc', sector: 'fitness', months: 5, metrics: [['spend', '$1 400'], ['clicks', '36 800'], ['cpc', '$0.038']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'google', type: 'googleSearchLeads', sector: 'dentist', months: 12, metrics: [['spend', '$5 400'], ['leads', '1 490'], ['cpl', '$3.62']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'google', type: 'googleSearchCalls', sector: 'autoService', months: 4, metrics: [['spend', '$1 200'], ['calls', '362'], ['costPerCall', '$3.31']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'google', type: 'googlePmax', sector: 'cosmetics', months: 6, metrics: [['spend', '$6 000'], ['orders', '1 870'], ['roas', '7.2×']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'google', type: 'googleShopping', sector: 'electronics', months: 3, metrics: [['spend', '$2 700'], ['clicks', '16 700'], ['cpc', '$0.16']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'google', type: 'googleDisplayRemarketing', sector: 'travel', months: 8, metrics: [['spend', '$2 000'], ['leads', '853'], ['cpl', '$2.34']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'google', type: 'googleYoutubeInStream', sector: 'university', months: 4, metrics: [['spend', '$1 600'], ['views', '219 000'], ['cpv', '$0.007']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'google', type: 'googleShorts', sector: 'fitness', months: 6, metrics: [['spend', '$1 700'], ['views', '952 000'], ['cpv', '$0.002']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'google', type: 'googleDemandGen', sector: 'realEstate', months: 3, metrics: [['spend', '$2 200'], ['leads', '291'], ['cpl', '$7.56']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'google', type: 'googleLocalPmax', sector: 'pharmacy', months: 5, metrics: [['spend', '$1 900'], ['storeVisits', '10 000'], ['costPerVisit', '$0.19']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'google', type: 'googleApp', sector: 'mobileApp', months: 6, metrics: [['spend', '$6 000'], ['installs', '12 700'], ['cpi', '$0.47']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'google', type: 'googleBrandSearch', sector: 'fintech', months: 3, metrics: [['spend', '$450'], ['clicks', '7 580'], ['cpc', '$0.059']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'google', type: 'googleDsa', sector: 'carDealer', months: 4, metrics: [['spend', '$2 000'], ['clicks', '8 000'], ['cpc', '$0.25']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'google', type: 'googleBumper', sector: 'event', months: 12, metrics: [['spend', '$9 000'], ['reach', '1 200 000'], ['cpm', '$0.54']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'google', type: 'googleLeadFormAsset', sector: 'insurance', months: 5, metrics: [['spend', '$2 000'], ['leads', '463'], ['cpl', '$4.32']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'google', type: 'googleCompetitor', sector: 'logistics', months: 3, metrics: [['spend', '$1 800'], ['leads', '284'], ['cpl', '$6.34']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'linkedin', type: 'linkedinLeadGen', sector: 'saas', months: 6, metrics: [['spend', '$7 200'], ['leads', '293'], ['cpl', '$24.57']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'linkedin', type: 'linkedinTraffic', sector: 'manufacturing', months: 9, metrics: [['spend', '$7 700'], ['clicks', '2 140'], ['cpc', '$3.60']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'linkedin', type: 'linkedinDocument', sector: 'lawFirm', months: 4, metrics: [['spend', '$3 200'], ['leads', '160'], ['cpl', '$20.00']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'linkedin', type: 'linkedinConversation', sector: 'logistics', months: 3, metrics: [['spend', '$2 700'], ['replies', '145'], ['costPerReply', '$18.62']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'linkedin', type: 'linkedinVideo', sector: 'construction', months: 6, metrics: [['spend', '$3 000'], ['views', '253 000'], ['cpv', '$0.012']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'linkedin', type: 'linkedinThoughtLeader', sector: 'saas', months: 4, metrics: [['spend', '$2 800'], ['engagements', '12 200'], ['costPerEngagement', '$0.23']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'linkedin', type: 'linkedinText', sector: 'manufacturing', months: 9, metrics: [['spend', '$3 850'], ['clicks', '1 210'], ['cpc', '$3.18']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'linkedin', type: 'linkedinFollowers', sector: 'lawFirm', months: 3, metrics: [['spend', '$1 050'], ['followers', '1 330'], ['costPerFollower', '$0.79']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'linkedin', type: 'linkedinEvent', sector: 'eduCenter', months: 5, metrics: [['spend', '$6 450'], ['registrations', '481'], ['costPerRegistration', '$13.41']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'linkedin', type: 'linkedinJobs', sector: 'recruitment', months: 12, metrics: [['spend', '$7 800'], ['applications', '960'], ['costPerApplication', '$8.13']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'linkedin', type: 'linkedinCarousel', sector: 'construction', months: 4, metrics: [['spend', '$2 200'], ['clicks', '716'], ['cpc', '$3.07']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'linkedin', type: 'linkedinConversions', sector: 'saas', months: 6, metrics: [['spend', '$6 000'], ['demoRequests', '231'], ['costPerDemo', '$25.97']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'linkedin', type: 'linkedinAbm', sector: 'manufacturing', months: 3, metrics: [['spend', '$2 000'], ['meetings', '12'], ['costPerMeeting', '$166.67']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'linkedin', type: 'linkedinRetarget', sector: 'logistics', months: 8, metrics: [['spend', '$3 200'], ['leads', '213'], ['cpl', '$15.02']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'linkedin', type: 'linkedinAwareness', sector: 'insurance', months: 4, metrics: [['spend', '$2 800'], ['reach', '72 000'], ['cpm', '$16.63']], bars: [62, 70, 58, 77, 85, 92, 100] },
  // Added later: Meta messages / awareness and TikTok direct / site traffic for local businesses.
  { platform: 'meta', type: 'metaMessages', sector: 'pawnshop', months: 6, metrics: [['spend', '$1 500'], ['messages', '2 730'], ['costPerMessage', '$0.55']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaAwareness', sector: 'coffeeShop', months: 3, metrics: [['spend', '$960'], ['reach', '532 000'], ['cpm', '$0.67']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'restoPub', months: 5, metrics: [['spend', '$1 450'], ['messages', '2 860'], ['costPerMessage', '$0.51']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'loungeRestaurant', months: 6, metrics: [['spend', '$1 800'], ['messages', '3 470'], ['costPerMessage', '$0.52']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'studyAbroad', months: 3, metrics: [['spend', '$1 200'], ['messages', '1 350'], ['costPerMessage', '$0.89']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'foreignLanguage', months: 4, metrics: [['spend', '$1 100'], ['messages', '1 890'], ['costPerMessage', '$0.58']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaAwareness', sector: 'barber', months: 12, metrics: [['spend', '$2 050'], ['reach', '662 000'], ['cpm', '$0.68']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'carDealer', months: 5, metrics: [['spend', '$2 500'], ['messages', '1 740'], ['costPerMessage', '$1.44']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'travel', months: 3, metrics: [['spend', '$1 050'], ['messages', '1 770'], ['costPerMessage', '$0.59']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaAwareness', sector: 'fitness', months: 6, metrics: [['spend', '$1 200'], ['reach', '637 000'], ['cpm', '$0.69']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'flowerShop', months: 9, metrics: [['spend', '$3 100'], ['messages', '7 290'], ['costPerMessage', '$0.43']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'cleaning', months: 4, metrics: [['spend', '$880'], ['messages', '1 220'], ['costPerMessage', '$0.72']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaAwareness', sector: 'dryCleaning', months: 3, metrics: [['spend', '$560'], ['reach', '362 000'], ['cpm', '$0.70']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaMessages', sector: 'karaoke', months: 6, metrics: [['spend', '$1 550'], ['messages', '3 430'], ['costPerMessage', '$0.45']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'buildingCompany', months: 4, metrics: [['spend', '$1 850'], ['messages', '730'], ['costPerMessage', '$2.53']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'renovation', months: 9, metrics: [['spend', '$2 900'], ['messages', '3 000'], ['costPerMessage', '$0.97']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'psychology', months: 3, metrics: [['spend', '$720'], ['messages', '663'], ['costPerMessage', '$1.09']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaAwareness', sector: 'eduCenter', months: 5, metrics: [['spend', '$1 250'], ['reach', '716 000'], ['cpm', '$0.74']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'logistics', months: 12, metrics: [['spend', '$3 600'], ['messages', '2 000'], ['costPerMessage', '$1.80']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'legalCenter', months: 4, metrics: [['spend', '$1 050'], ['messages', '800'], ['costPerMessage', '$1.31']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'meta', type: 'metaAwareness', sector: 'sweetShop', months: 6, metrics: [['spend', '$1 800'], ['reach', '681 000'], ['cpm', '$0.67']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'studyAbroad', months: 3, metrics: [['spend', '$900'], ['messages', '1 290'], ['costPerMessage', '$0.70']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'foreignLanguage', months: 8, metrics: [['spend', '$2 050'], ['clicks', '53 300'], ['cpc', '$0.038']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'cleaning', months: 4, metrics: [['spend', '$910'], ['messages', '1 380'], ['costPerMessage', '$0.66']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'dryCleaning', months: 6, metrics: [['spend', '$1 550'], ['clicks', '41 400'], ['cpc', '$0.037']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'renovation', months: 3, metrics: [['spend', '$780'], ['messages', '758'], ['costPerMessage', '$1.03']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'psychology', months: 5, metrics: [['spend', '$1 000'], ['clicks', '24 200'], ['cpc', '$0.041']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'eduCenter', months: 6, metrics: [['spend', '$1 300'], ['messages', '2 200'], ['costPerMessage', '$0.59']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'legalCenter', months: 3, metrics: [['spend', '$720'], ['clicks', '12 000'], ['cpc', '$0.060']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'tiktok', type: 'tiktokDirect', sector: 'accessories', months: 4, metrics: [['spend', '$860'], ['messages', '1 680'], ['costPerMessage', '$0.51']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'tiktok', type: 'tiktokTraffic', sector: 'petShop', months: 12, metrics: [['spend', '$2 900'], ['clicks', '78 100'], ['cpc', '$0.037']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'petShop', months: 4, metrics: [['spend', '$480'], ['messages', '1 150'], ['costPerMessage', '$0.42']], bars: [38, 46, 52, 61, 70, 84, 100] },
  { platform: 'meta', type: 'metaLeadForms', sector: 'dentalClinic', months: 6, metrics: [['spend', '$1 800'], ['leads', '1 240'], ['cpl', '$1.45']], bars: [55, 48, 63, 71, 66, 88, 100] },
  { platform: 'meta', type: 'metaConversions', sector: 'phoneStore', months: 6, metrics: [['spend', '$3 000'], ['orders', '410'], ['cpa', '$7.32']], bars: [30, 41, 57, 52, 74, 90, 100] },
  { platform: 'meta', type: 'metaMessages', sector: 'visaCenter', months: 5, metrics: [['spend', '$1 100'], ['messages', '1 480'], ['costPerMessage', '$0.74']], bars: [62, 70, 58, 77, 85, 92, 100] },
  { platform: 'google', type: 'googlePmax', sector: 'petShop', months: 6, metrics: [['spend', '$2 400'], ['orders', '690'], ['roas', '5.4×']], bars: [44, 52, 60, 68, 79, 95, 100] },
  { platform: 'google', type: 'googleSearchLeads', sector: 'studyAbroad', months: 9, metrics: [['spend', '$3 600'], ['leads', '520'], ['cpl', '$6.92']], bars: [48, 65, 72, 60, 83, 91, 98] },
  { platform: 'google', type: 'googleSearchCalls', sector: 'cleaning', months: 4, metrics: [['spend', '$900'], ['calls', '410'], ['costPerCall', '$2.20']], bars: [35, 50, 46, 69, 78, 87, 100] },
  { platform: 'google', type: 'googleYoutubeInStream', sector: 'renovation', months: 3, metrics: [['spend', '$750'], ['views', '125 000'], ['cpv', '$0.006']], bars: [58, 64, 75, 72, 88, 94, 100] },
  { platform: 'google', type: 'googleShorts', sector: 'psychology', months: 3, metrics: [['spend', '$450'], ['views', '210 000'], ['cpv', '$0.002']], bars: [38, 46, 52, 61, 70, 84, 100] },
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
