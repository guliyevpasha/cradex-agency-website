'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Search, Video, Linkedin, Plus, Minus, MessageCircle, ChevronDown, ChevronUp, CheckCircle2, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AdService {
  id: string
  name: string
  price: number
  icon: React.ReactNode
  description: string
  includes: string[]
  additionalServices: AdditionalService[]
}

interface AdditionalService {
  id: string
  name: string
  price: number
  type: 'fixed' | 'slider' | 'monthly'
  min?: number
  max?: number
}

const AD_SERVICES: AdService[] = [
  {
    id: 'meta',
    name: 'metaAdsName',
    price: 350,
    icon: <Facebook className="w-6 h-6" />,
    description: 'metaAdsDescription',
    includes: [
      'metaIncludes.businessManager',
      'metaIncludes.adAccount',
      'metaIncludes.pixelSetup',
      'metaIncludes.campaign',
      'metaIncludes.targeting',
      'metaIncludes.creatives',
      'metaIncludes.adCopy',
      'metaIncludes.optimization',
      'metaIncludes.report'
    ],
    additionalServices: [
      { id: 'meta_campaign', name: 'metaAdditional.extraCampaign', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'meta_creative', name: 'metaAdditional.extraCreative', price: 25, type: 'slider', min: 1, max: 10 },
      { id: 'meta_reels', name: 'metaAdditional.reelsEditing', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'meta_motion', name: 'metaAdditional.motionDesign', price: 70, type: 'slider', min: 1, max: 10 },
      { id: 'meta_text', name: 'metaAdditional.adCopywriting', price: 30, type: 'slider', min: 1, max: 10 },
      { id: 'meta_whatsapp_catalog', name: 'metaAdditional.whatsappCatalog', price: 50, type: 'slider', min: 1, max: 10 },
      { id: 'meta_ecommerce_catalog', name: 'metaAdditional.ecommerceCatalog', price: 100, type: 'slider', min: 1, max: 10 },
      { id: 'meta_software_ad', name: 'metaAdditional.softwareAd', price: 100, type: 'fixed' },
      { id: 'meta_pixel', name: 'metaAdditional.pixelSetup', price: 120, type: 'fixed' },
      { id: 'meta_api', name: 'metaAdditional.conversionApi', price: 180, type: 'fixed' },
      { id: 'meta_dm', name: 'metaAdditional.dmService', price: 250, type: 'monthly' },
      { id: 'meta_influencer', name: 'metaAdditional.influencerManagement', price: 150, type: 'fixed' },
      { id: 'meta_ab', name: 'metaAdditional.abTesting', price: 100, type: 'fixed' }
    ]
  },
  {
    id: 'google',
    name: 'googleAdsName',
    price: 450,
    icon: <Search className="w-6 h-6" />,
    description: 'googleAdsDescription',
    includes: [
      'googleIncludes.accountSetup',
      'googleIncludes.searchCampaign',
      'googleIncludes.keywordResearch',
      'googleIncludes.negativeKeywords',
      'googleIncludes.adGroups',
      'googleIncludes.adCopy',
      'googleIncludes.conversionTracking',
      'googleIncludes.monthlyReport'
    ],
    additionalServices: [
      { id: 'google_banner', name: 'googleAdditional.displayBanners', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'google_tag', name: 'googleAdditional.tagManager', price: 120, type: 'fixed' },
      { id: 'google_conversion', name: 'googleAdditional.conversionTracking', price: 150, type: 'fixed' },
      { id: 'google_analytics', name: 'googleAdditional.analytics4', price: 180, type: 'fixed' },
      { id: 'google_youtube', name: 'googleAdditional.youtubeSetup', price: 250, type: 'fixed' },
      { id: 'google_remarketing', name: 'googleAdditional.remarketingCampaign', price: 140, type: 'fixed' },
      { id: 'google_keywords', name: 'googleAdditional.keywordResearch', price: 100, type: 'fixed' },
      { id: 'google_landing', name: 'googleAdditional.landingPageAnalysis', price: 150, type: 'fixed' },
      { id: 'google_seo', name: 'googleAdditional.seoAudit', price: 300, type: 'fixed' }
    ]
  },
  {
    id: 'tiktok',
    name: 'tiktokAdsName',
    price: 400,
    icon: <Video className="w-6 h-6" />,
    description: 'tiktokAdsDescription',
    includes: [
      'tiktokIncludes.accountSetup',
      'tiktokIncludes.pixelIntegration',
      'tiktokIncludes.campaign',
      'tiktokIncludes.audienceAnalysis',
      'tiktokIncludes.videoCreatives',
      'tiktokIncludes.optimization',
      'tiktokIncludes.monthlyReport'
    ],
    additionalServices: [
      { id: 'tiktok_video', name: 'tiktokAdditional.videoEditing', price: 50, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_ugc', name: 'tiktokAdditional.ugcScript', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_viral', name: 'tiktokAdditional.viralPlanning', price: 120, type: 'fixed' },
      { id: 'tiktok_pixel', name: 'tiktokAdditional.pixelSetup', price: 120, type: 'fixed' },
      { id: 'tiktok_creator', name: 'tiktokAdditional.creatorFinding', price: 150, type: 'fixed' },
      { id: 'tiktok_trend', name: 'tiktokAdditional.trendResearch', price: 70, type: 'fixed' },
      { id: 'tiktok_shop', name: 'tiktokAdditional.shopIntegration', price: 250, type: 'fixed' }
    ]
  },
  {
    id: 'linkedin',
    name: 'linkedinAdsName',
    price: 500,
    icon: <Linkedin className="w-6 h-6" />,
    description: 'linkedinAdsDescription',
    includes: [
      'linkedinIncludes.campaignManager',
      'linkedinIncludes.b2bTargeting',
      'linkedinIncludes.leadGenCampaign',
      'linkedinIncludes.sponsoredPosts',
      'linkedinIncludes.adCopy',
      'linkedinIncludes.monthlyOptimization',
      'linkedinIncludes.reportPresentation'
    ],
    additionalServices: [
      { id: 'linkedin_optimization', name: 'linkedinAdditional.pageOptimization', price: 180, type: 'fixed' },
      { id: 'linkedin_b2b', name: 'linkedinAdditional.b2bLeadStrategy', price: 250, type: 'fixed' },
      { id: 'linkedin_text', name: 'linkedinAdditional.corporateCopy', price: 50, type: 'fixed' },
      { id: 'linkedin_employer', name: 'linkedinAdditional.employerBranding', price: 400, type: 'fixed' },
      { id: 'linkedin_form', name: 'linkedinAdditional.leadFormSetup', price: 120, type: 'fixed' },
      { id: 'linkedin_ceo', name: 'linkedinAdditional.ceoPersonalBrand', price: 500, type: 'monthly' },
      { id: 'linkedin_content', name: 'linkedinAdditional.contentPlan', price: 200, type: 'fixed' }
    ]
  }
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'fixed' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

export default function DigitalAdsCalculator() {
  const t = useTranslations('calculator.digitalAds')
  const locale = useLocale() as 'az' | 'en' | 'ru' | 'tr'
  
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [additionalSelections, setAdditionalSelections] = useState<Record<string, number>>({})
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const updateAdditionalService = (serviceId: string, value: number) => {
    setAdditionalSelections(prev => ({
      ...prev,
      [serviceId]: value
    }))
  }

  const calculateTotal = () => {
    let oneTimeTotal = 0
    let monthlyTotal = 0

    // Main services (monthly)
    selectedServices.forEach(serviceId => {
      const service = AD_SERVICES.find(s => s.id === serviceId)
      if (service) {
        monthlyTotal += service.price
      }
    })

    // Additional services
    Object.entries(additionalSelections).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        AD_SERVICES.forEach(service => {
          const additionalService = service.additionalServices.find(as => as.id === serviceId)
          if (additionalService) {
            if (additionalService.type === 'monthly') {
              // Monthly services
              monthlyTotal += additionalService.price * quantity
            } else if (additionalService.type === 'slider') {
              // Slider services (one-time)
              oneTimeTotal += additionalService.price * quantity
            } else if (additionalService.type === 'fixed') {
              // Fixed services (one-time)
              oneTimeTotal += additionalService.price
            }
          }
        })
      }
    })

    return { oneTime: oneTimeTotal, monthly: monthlyTotal, total: oneTimeTotal + monthlyTotal }
  }

  const totals = calculateTotal()

  // Apply coupon discount (only applied to monthly price)
  let discountAmount = 0
  let finalMonthlyPrice = totals.monthly
  let finalTotalPrice = totals.total
  
  if (appliedCoupon) {
    if (appliedCoupon.discount > 0) {
      discountAmount = appliedCoupon.discount
      finalMonthlyPrice = totals.monthly - discountAmount
      finalTotalPrice = totals.oneTime + finalMonthlyPrice
    }
  }

  // Coupon application function
  const applyCoupon = () => {
    const coupon = COUPON_CODES.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      let discount = 0
      if (coupon.type === 'percentage') {
        discount = Math.round((totals.monthly * coupon.discount) / 100)
      } else {
        discount = coupon.discount
      }
      setAppliedCoupon({ code: coupon.code, discount })
      setCouponCode('')
    } else {
      alert(t('invalidCoupon'))
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  // WhatsApp message
  const whatsappNumber = '994507786887'
  const selectedServiceNames = selectedServices.map(id => {
    const service = AD_SERVICES.find(s => s.id === id)
    return service ? t(service.name) : ''
  }).join(', ')
  
  const msg = encodeURIComponent(
    `${t('faqA1').split('.')[0]}! ${t('title')}: ${selectedServiceNames}. ${appliedCoupon ? `${t('discountCoupon')}: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}${totals.oneTime > 0 ? `${t('additionalPayments')}: ${totals.oneTime} AZN. ` : ''}${t('monthly')}: ${finalMonthlyPrice} AZN. ${t('totalAmount')}: ${finalTotalPrice} AZN.`
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
      {/* ── Left: Calculator ── */}
      <div className="xl:col-span-3 space-y-4 lg:space-y-5">



        {/* Service Selection */}
        <div className="space-y-4">
          {AD_SERVICES.map((service) => (
            <motion.div
              key={service.id}
              className={cn(
                'rounded-2xl border p-5 cursor-pointer transition-all',
                selectedServices.includes(service.id)
                  ? 'border-accent-primary/60 bg-accent-primary/5'
                  : 'border-white/10 bg-bg-secondary/50 hover:border-white/25'
              )}
              onClick={() => toggleService(service.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-2 rounded-xl',
                    selectedServices.includes(service.id) 
                      ? 'text-accent-primary bg-accent-primary/10' 
                      : 'text-text-secondary bg-bg-tertiary'
                  )}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {t(service.name)}
                    </h3>
                    <p className="text-text-secondary text-sm">{t(service.description)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-xl font-bold',
                    selectedServices.includes(service.id) ? 'text-accent-primary' : 'text-text-primary'
                  )}>
                    {service.price}₼
                  </div>
                  <div className="text-xs text-text-muted">{t('monthly')}</div>
                </div>
              </div>

              {/* Included Services */}
              <div className="mb-4 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                <h4 className="font-medium text-green-400 text-xs mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {t('includedServices')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {service.includes.map((item, index) => (
                    <div key={index} className="flex items-center text-xs text-text-secondary">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 shrink-0"></span>
                      {t(item)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              {selectedServices.includes(service.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/10 pt-4 mt-4"
                >
                  <h4 className="font-medium text-text-primary text-sm mb-3">{t('additionalServices')}:</h4>
                  <div className="space-y-2">
                    {service.additionalServices.map((additionalService) => (
                      <div key={additionalService.id} className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-xl border border-white/10">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-text-primary">
                            {t(additionalService.name)}
                          </span>
                          <div className="text-xs text-text-secondary">
                            {additionalService.price}₼
                            {additionalService.type === 'monthly' && ` / ${t('monthly')}`}
                            {additionalService.type === 'slider' && ` / ${t('perUnit')}`}
                          </div>
                        </div>
                        
                        {additionalService.type === 'slider' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const current = additionalSelections[additionalService.id] || 0
                                if (current > 0) {
                                  updateAdditionalService(additionalService.id, current - 1)
                                }
                              }}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 text-text-secondary"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-text-primary">
                              {additionalSelections[additionalService.id] || 0}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const current = additionalSelections[additionalService.id] || 0
                                if (current < (additionalService.max || 10)) {
                                  updateAdditionalService(additionalService.id, current + 1)
                                }
                              }}
                              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 text-text-secondary"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={additionalSelections[additionalService.id] > 0}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateAdditionalService(additionalService.id, e.target.checked ? 1 : 0)
                              }}
                              className="w-4 h-4 text-accent-primary border-white/20 rounded focus:ring-accent-primary bg-transparent"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Price + CTA (mobile) */}
        <div className="xl:hidden rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-4 lg:p-5">
          <p className="text-text-muted text-xs mb-1">{t('totalAmount')}</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totals.total} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          {totals.oneTime > 0 && (
            <p className="text-sm text-text-secondary mb-1">
              {t('additionalPayments')}: <span className="font-semibold text-text-primary">{totals.oneTime} AZN</span>
            </p>
          )}
          <p className="text-sm text-text-secondary mb-1">
            {t('monthly')}: <span className="font-semibold text-text-primary">{finalMonthlyPrice} AZN</span>
          </p>
          <p className="text-3xl font-display font-bold gradient-text mb-4">
            {finalTotalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          <p className="text-text-muted text-[10px] mb-4">{t('taxIncluded')}</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm"
          >
            <MessageCircle size={16} />
            {t('orderNow')}
          </a>
        </div>
      </div>

      {/* ── Right: Info panel ── */}
      <div className="xl:col-span-2 space-y-4">

        {/* Price panel (desktop) */}
        <div
          className="hidden xl:block rounded-2xl p-4 lg:p-5 sticky top-24"
          style={{
            background: 'linear-gradient(160deg, #0f0f1e, #13132a)',
            border: '1px solid rgba(108,99,255,0.3)',
            boxShadow: '0 0 30px rgba(108,99,255,0.1)',
          }}
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded mb-4" />
          <p className="text-text-muted text-xs mb-1">{t('totalAmount')}</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totals.total} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          {totals.oneTime > 0 && (
            <p className="text-sm text-text-secondary mb-1">
              {t('additionalPayments')}: <span className="font-semibold text-text-primary">{totals.oneTime} AZN</span>
            </p>
          )}
          <p className="text-sm text-text-secondary mb-2">
            {t('monthly')}: <span className="font-semibold text-text-primary">{finalMonthlyPrice} AZN</span>
          </p>
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {finalTotalPrice}
            <span className="text-base text-text-secondary font-normal ml-1">AZN</span>
          </p>
          <p className="text-text-muted text-[10px] mb-2">{t('taxIncluded')}</p>
          <p className="text-text-muted text-[10px] mb-4 flex items-center justify-center gap-1.5"><Rocket className="w-3 h-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />{t('professionalTeam')}</p>
          
          {/* Coupon Section */}
          <div className="mb-4 p-3 rounded-xl bg-bg-secondary/50 border border-white/10">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {t('discountCoupon')}
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-400 font-medium">{appliedCoupon.code}</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  {t('cancelCoupon')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder={t('enterCouponCode')}
                  className="flex-1 px-3 py-2 rounded-lg bg-bg-tertiary border border-white/10 text-text-primary text-xs placeholder-text-muted focus:border-accent-primary focus:outline-none"
                />
                <button
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                  className="px-3 py-2 rounded-lg bg-accent-primary text-white text-xs font-medium hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {t('applyCoupon')}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #25D366, #20bd5a)', boxShadow: '0 0 16px rgba(37,211,102,0.3)' }}
            >
              <MessageCircle size={16} />
              {t('orderNow')}
            </a>
          </div>
        </div>

        {/* Service Requirements */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">{t('serviceRequirements')}</h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.companyInfo')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.targetAudience')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.productImages')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.adBudget')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.website')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('serviceRequirementsItems.contactInfo')}
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">{t('faq')}</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
                >
                  {t(`faqQ${i}`)}
                  {openFaq === i ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                    {t(`faqA${i}`)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}