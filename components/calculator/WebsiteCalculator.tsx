'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Globe, ShoppingCart, Plus, Minus, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Website Service Types ────────────────────────────────────────────────────
interface WebsiteService {
  id: string
  name: string
  basePrice: number
  icon: React.ReactNode
  description: string
  includes: string[]
  designComplexity: {
    simple: number    // multiplier
    professional: number
    custom: number
  }
  deliveryTime: {
    standard: number  // multiplier
    fast: number      // 14 days
    urgent: number    // 7 days
  }
  additionalServices: AdditionalWebService[]
}

interface AdditionalWebService {
  id: string
  name: string
  price: number
  type: 'fixed' | 'slider'
  min?: number
  max?: number
  step?: number
  unit?: string
}

// ── Website Services Data ────────────────────────────────────────────────────
const WEBSITE_SERVICES: WebsiteService[] = [
  {
    id: 'corporate',
    name: 'corporateName',
    basePrice: 900,
    icon: <Globe className="w-6 h-6" />,
    description: 'corporateDescription',
    includes: [
      'corporateIncludes.adminPanel',
      'corporateIncludes.domainHosting',
      'corporateIncludes.pages5',
      'corporateIncludes.mobileResponsive',
      'corporateIncludes.contactForm',
      'corporateIncludes.facebookPixel',
      'corporateIncludes.favicon',
      'corporateIncludes.whatsappIntegration',
      'corporateIncludes.basicSeo',
      'corporateIncludes.imageOptimization',
      'corporateIncludes.speedOptimization',
      'corporateIncludes.security',
      'corporateIncludes.support3Months',
      'corporateIncludes.socialMedia3',
    ],
    designComplexity: {
      simple: 1,
      professional: 1.3,
      custom: 1.6,
    },
    deliveryTime: {
      standard: 1,
      fast: 1.25,
      urgent: 1.5,
    },
    additionalServices: [
      { id: 'corp_multilang', name: 'corporateAdditional.multilang', price: 50, type: 'slider', min: 1, max: 10, step: 1, unit: 'language' },
      { id: 'corp_blog', name: 'corporateAdditional.blogSystem', price: 150, type: 'fixed' },
      { id: 'corp_logo', name: 'corporateAdditional.logoDesign', price: 200, type: 'fixed' },
      { id: 'corp_favicon_design', name: 'corporateAdditional.faviconDesign', price: 50, type: 'fixed' },
      { id: 'corp_member', name: 'corporateAdditional.memberLogin', price: 250, type: 'fixed' },
      { id: 'corp_faq', name: 'corporateAdditional.faq', price: 60, type: 'fixed' },
      { id: 'corp_team', name: 'corporateAdditional.teamPage', price: 80, type: 'fixed' },
      { id: 'corp_animations', name: 'corporateAdditional.customAnimations', price: 200, type: 'fixed' },
      { id: 'corp_booking', name: 'corporateAdditional.bookingSystem', price: 350, type: 'fixed' },
      { id: 'corp_livechat', name: 'corporateAdditional.liveChat', price: 120, type: 'fixed' },
      { id: 'corp_search', name: 'corporateAdditional.searchFunction', price: 120, type: 'fixed' },
      { id: 'corp_blog_writing', name: 'corporateAdditional.blogWriting', price: 25, type: 'slider', min: 1, max: 100, step: 1, unit: 'article' },
      { id: 'corp_advanced_seo', name: 'corporateAdditional.advancedSeo', price: 300, type: 'fixed' },
      { id: 'corp_email', name: 'corporateAdditional.emailIntegration', price: 150, type: 'fixed' },
      { id: 'corp_analytics', name: 'corporateAdditional.googleAnalytics', price: 100, type: 'fixed' },
      { id: 'corp_calendar', name: 'corporateAdditional.eventCalendar', price: 200, type: 'fixed' },
      { id: 'corp_video', name: 'corporateAdditional.videoIntegration', price: 120, type: 'fixed' },
      { id: 'corp_extra_pages', name: 'corporateAdditional.extraPages', price: 50, type: 'slider', min: 1, max: 50, step: 1, unit: 'page' },
      { id: 'corp_support_1year', name: 'corporateAdditional.support1Year', price: 150, type: 'fixed' },
      { id: 'corp_api', name: 'corporateAdditional.apiIntegration', price: 300, type: 'fixed' },
    ],
  },
  {
    id: 'ecommerce',
    name: 'ecommerceName',
    basePrice: 1800,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: 'ecommerceDescription',
    includes: [
      'ecommerceIncludes.domainHosting',
      'ecommerceIncludes.pages5',
      'ecommerceIncludes.mobileResponsive',
      'ecommerceIncludes.favicon',
      'ecommerceIncludes.onlineStore',
      'ecommerceIncludes.productPlacement20',
      'ecommerceIncludes.cartOrder',
      'ecommerceIncludes.facebookPixel',
      'ecommerceIncludes.metaTags',
      'ecommerceIncludes.socialMedia3',
      'ecommerceIncludes.whatsappOrder',
      'ecommerceIncludes.campaignDiscount',
      'ecommerceIncludes.basicSeo',
      'ecommerceIncludes.adminPanel',
    ],
    designComplexity: {
      simple: 1,
      professional: 1.3,
      custom: 1.6,
    },
    deliveryTime: {
      standard: 1,
      fast: 1.25,
      urgent: 1.5,
    },
    additionalServices: [
      { id: 'ecom_cargo', name: 'ecommerceAdditional.cargoIntegration', price: 350, type: 'fixed' },
      { id: 'ecom_multicurrency', name: 'ecommerceAdditional.multicurrency', price: 300, type: 'fixed' },
      { id: 'ecom_marketplace', name: 'ecommerceAdditional.marketplace', price: 1200, type: 'fixed' },
      { id: 'ecom_filter', name: 'ecommerceAdditional.productFilter', price: 250, type: 'fixed' },
      { id: 'ecom_loyalty', name: 'ecommerceAdditional.loyaltySystem', price: 400, type: 'fixed' },
      { id: 'ecom_sms', name: 'ecommerceAdditional.smsNotification', price: 200, type: 'fixed' },
      { id: 'ecom_extra_products', name: 'ecommerceAdditional.extraProducts', price: 150, type: 'slider', min: 50, max: 500, step: 50, unit: 'products' },
      { id: 'ecom_premium_page', name: 'ecommerceAdditional.premiumProductPage', price: 300, type: 'fixed' },
      { id: 'ecom_instagram', name: 'ecommerceAdditional.instagramShop', price: 250, type: 'fixed' },
      { id: 'ecom_support_1year', name: 'ecommerceAdditional.support1Year', price: 150, type: 'fixed' },
      { id: 'ecom_api', name: 'ecommerceAdditional.apiIntegration', price: 300, type: 'fixed' },
      { id: 'ecom_blog', name: 'ecommerceAdditional.blogSystem', price: 150, type: 'fixed' },
      { id: 'ecom_logo', name: 'ecommerceAdditional.logoDesign', price: 200, type: 'fixed' },
      { id: 'ecom_member', name: 'ecommerceAdditional.memberLogin', price: 250, type: 'fixed' },
      { id: 'ecom_faq', name: 'ecommerceAdditional.faq', price: 60, type: 'fixed' },
      { id: 'ecom_team', name: 'ecommerceAdditional.teamPage', price: 80, type: 'fixed' },
      { id: 'ecom_animations', name: 'ecommerceAdditional.customAnimations', price: 200, type: 'fixed' },
      { id: 'ecom_livechat', name: 'ecommerceAdditional.liveChat', price: 120, type: 'fixed' },
      { id: 'ecom_product_search', name: 'ecommerceAdditional.productSearch', price: 120, type: 'fixed' },
      { id: 'ecom_blog_writing', name: 'ecommerceAdditional.blogWriting', price: 25, type: 'slider', min: 1, max: 100, step: 1, unit: 'article' },
      { id: 'ecom_advanced_seo', name: 'ecommerceAdditional.advancedSeo', price: 300, type: 'fixed' },
      { id: 'ecom_email', name: 'ecommerceAdditional.emailIntegration', price: 150, type: 'fixed' },
      { id: 'ecom_analytics', name: 'ecommerceAdditional.googleAnalytics', price: 100, type: 'fixed' },
      { id: 'ecom_calendar', name: 'ecommerceAdditional.eventCalendar', price: 200, type: 'fixed' },
      { id: 'ecom_favicon_design', name: 'ecommerceAdditional.faviconDesign', price: 50, type: 'fixed' },
      { id: 'ecom_comparison', name: 'ecommerceAdditional.productComparison', price: 150, type: 'fixed' },
      { id: 'ecom_variants', name: 'ecommerceAdditional.productVariants', price: 150, type: 'fixed' },
      { id: 'ecom_filters', name: 'ecommerceAdditional.productFilters', price: 150, type: 'fixed' },
      { id: 'ecom_local_bank', name: 'ecommerceAdditional.localBankIntegration', price: 400, type: 'fixed' },
      { id: 'ecom_paypal', name: 'ecommerceAdditional.paypalIntegration', price: 300, type: 'fixed' },
      { id: 'ecom_zoom', name: 'ecommerceAdditional.productZoom', price: 80, type: 'fixed' },
      { id: 'ecom_related', name: 'ecommerceAdditional.relatedProducts', price: 100, type: 'fixed' },
      { id: 'ecom_rating', name: 'ecommerceAdditional.ratingSystem', price: 100, type: 'fixed' },
      { id: 'ecom_stock_alert', name: 'ecommerceAdditional.stockAlerts', price: 100, type: 'fixed' },
      { id: 'ecom_reviews', name: 'ecommerceAdditional.productReviews', price: 150, type: 'fixed' },
      { id: 'ecom_sales_reports', name: 'ecommerceAdditional.salesReports', price: 200, type: 'fixed' },
      { id: 'ecom_delivery_tracking', name: 'ecommerceAdditional.deliveryTracking', price: 200, type: 'fixed' },
      { id: 'ecom_order_history', name: 'ecommerceAdditional.orderHistory', price: 150, type: 'fixed' },
      { id: 'ecom_wishlist', name: 'ecommerceAdditional.wishlist', price: 160, type: 'fixed' },
      { id: 'ecom_video', name: 'ecommerceAdditional.videoIntegration', price: 120, type: 'fixed' },
      { id: 'ecom_inventory', name: 'ecommerceAdditional.inventoryTracking', price: 200, type: 'fixed' },
      { id: 'ecom_flat_shipping', name: 'ecommerceAdditional.flatShipping', price: 100, type: 'fixed' },
      { id: 'ecom_weight_shipping', name: 'ecommerceAdditional.weightShipping', price: 200, type: 'fixed' },
      { id: 'ecom_distance_shipping', name: 'ecommerceAdditional.distanceShipping', price: 150, type: 'fixed' },
      { id: 'ecom_discount_codes', name: 'ecommerceAdditional.discountCodes', price: 200, type: 'fixed' },
      { id: 'ecom_save_cart', name: 'ecommerceAdditional.saveCart', price: 150, type: 'fixed' },
      { id: 'ecom_email_notifications', name: 'ecommerceAdditional.emailNotifications', price: 150, type: 'fixed' },
      { id: 'ecom_competitor_analysis', name: 'ecommerceAdditional.competitorAnalysis', price: 250, type: 'fixed' },
      { id: 'ecom_google_business', name: 'ecommerceAdditional.googleBusiness', price: 100, type: 'fixed' },
      { id: 'ecom_xml_sitemap', name: 'ecommerceAdditional.xmlSitemap', price: 80, type: 'fixed' },
      { id: 'ecom_onpage_seo', name: 'ecommerceAdditional.onpageSeo', price: 150, type: 'fixed' },
      { id: 'ecom_local_seo', name: 'ecommerceAdditional.localSeo', price: 300, type: 'fixed' },
      { id: 'ecom_category', name: 'ecommerceAdditional.categorySystem', price: 300, type: 'fixed' },
      { id: 'ecom_schema', name: 'ecommerceAdditional.schemaMarkup', price: 200, type: 'fixed' },
      { id: 'ecom_extra_pages', name: 'ecommerceAdditional.extraPages', price: 50, type: 'slider', min: 1, max: 50, step: 1, unit: 'page' },
    ],
  },
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'percentage' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

export default function WebsiteCalculator() {
  const t = useTranslations('calculator.website')
  
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [designComplexity, setDesignComplexity] = useState<'simple' | 'professional' | 'custom'>('simple')
  const [deliveryTime, setDeliveryTime] = useState<'standard' | 'fast' | 'urgent'>('standard')
  const [additionalSelections, setAdditionalSelections] = useState<Record<string, number>>({})
  const [monthlyPayment, setMonthlyPayment] = useState<3 | 6 | 12 | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const toggleService = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId)
    // Reset selections when changing service
    if (selectedService !== serviceId) {
      setAdditionalSelections({})
      setDesignComplexity('simple')
      setDeliveryTime('standard')
      setMonthlyPayment(null)
    }
  }

  const updateAdditionalService = (serviceId: string, value: number) => {
    setAdditionalSelections(prev => ({
      ...prev,
      [serviceId]: value
    }))
  }

  const calculateTotal = () => {
    if (!selectedService) return { base: 0, additional: 0, total: 0 }

    const service = WEBSITE_SERVICES.find(s => s.id === selectedService)
    if (!service) return { base: 0, additional: 0, total: 0 }

    // Base price with design complexity
    let basePrice = service.basePrice * service.designComplexity[designComplexity]
    
    // Apply delivery time multiplier
    basePrice = basePrice * service.deliveryTime[deliveryTime]

    // Additional services
    let additionalTotal = 0
    Object.entries(additionalSelections).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const additionalService = service.additionalServices.find(as => as.id === serviceId)
        if (additionalService) {
          if (additionalService.type === 'slider') {
            // For slider services with step
            if (additionalService.unit === 'products') {
              // Special case: 50 products = 150 AZN, 100 = 300, etc.
              additionalTotal += (quantity / 50) * additionalService.price
            } else {
              additionalTotal += additionalService.price * quantity
            }
          } else {
            additionalTotal += additionalService.price
          }
        }
      }
    })

    const total = Math.round(basePrice + additionalTotal)
    return { base: Math.round(basePrice), additional: Math.round(additionalTotal), total }
  }

  const totals = calculateTotal()

  // Apply coupon discount
  let discountAmount = 0
  let finalTotalPrice = totals.total
  
  if (appliedCoupon) {
    if (appliedCoupon.discount > 0) {
      discountAmount = appliedCoupon.discount
      finalTotalPrice = totals.total - discountAmount
    }
  }

  // Monthly payment calculation
  const initialPayment = monthlyPayment ? Math.round(finalTotalPrice * 0.5) : 0
  const monthlyAmount = monthlyPayment ? Math.round((finalTotalPrice - initialPayment) / monthlyPayment) : 0

  // Coupon application
  const applyCoupon = () => {
    const coupon = COUPON_CODES.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      let discount = 0
      if (coupon.type === 'percentage') {
        discount = Math.round((totals.total * coupon.discount) / 100)
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
  const selectedServiceData = WEBSITE_SERVICES.find(s => s.id === selectedService)
  const serviceName = selectedServiceData ? t(selectedServiceData.name) : ''
  
  const msg = encodeURIComponent(
    `Salam! ${t('title')}: ${serviceName}. ${t('designComplexity')}: ${t(`complexity.${designComplexity}`)}. ${t('deliveryTime')}: ${t(`delivery.${deliveryTime}`)}. ${appliedCoupon ? `${t('discountCoupon')}: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}${t('totalAmount')}: ${finalTotalPrice} AZN.${monthlyPayment ? ` ${t('monthlyPayment')}: ${monthlyPayment} ${t('months')} (${t('initialPayment')}: ${initialPayment} AZN, ${t('monthly')}: ${monthlyAmount} AZN)` : ''}`
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
      {/* ── Left: Calculator ── */}
      <div className="xl:col-span-3 space-y-4 lg:space-y-5">

        {/* Service Selection */}
        <div className="space-y-4">
          {WEBSITE_SERVICES.map((service) => (
            <motion.div
              key={service.id}
              className={cn(
                'rounded-2xl border p-5 cursor-pointer transition-all',
                selectedService === service.id
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
                    selectedService === service.id 
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
                    selectedService === service.id ? 'text-accent-primary' : 'text-text-primary'
                  )}>
                    {service.basePrice}₼
                  </div>
                  <div className="text-xs text-text-muted">{t('startingFrom')}</div>
                </div>
              </div>

              {/* Included Services */}
              <div className="mb-4 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                <h4 className="font-medium text-green-400 text-xs mb-2 flex items-center gap-2">
                  ✅ {t('includedServices')}
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

              {/* Design Complexity & Delivery Time */}
              {selectedService === service.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Design Complexity */}
                  <div>
                    <h4 className="font-medium text-text-primary text-sm mb-3">{t('designComplexity')}:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {(['simple', 'professional', 'custom'] as const).map((complexity) => (
                        <button
                          key={complexity}
                          onClick={(e) => {
                            e.stopPropagation()
                            setDesignComplexity(complexity)
                          }}
                          className={cn(
                            'p-3 rounded-xl border text-center transition-all',
                            designComplexity === complexity
                              ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                              : 'border-white/10 bg-bg-tertiary/50 text-text-secondary hover:border-white/25'
                          )}
                        >
                          <div className="text-sm font-medium">{t(`complexity.${complexity}`)}</div>
                          <div className="text-xs mt-1">×{service.designComplexity[complexity]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <h4 className="font-medium text-text-primary text-sm mb-3">{t('deliveryTime')}:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {(['standard', 'fast', 'urgent'] as const).map((delivery) => (
                        <button
                          key={delivery}
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeliveryTime(delivery)
                          }}
                          className={cn(
                            'p-3 rounded-xl border text-center transition-all',
                            deliveryTime === delivery
                              ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                              : 'border-white/10 bg-bg-tertiary/50 text-text-secondary hover:border-white/25'
                          )}
                        >
                          <div className="text-sm font-medium">
                            {delivery === 'urgent' && '🚀 '}
                            {delivery === 'fast' && '⚡ '}
                            {t(`delivery.${delivery}`)}
                          </div>
                          <div className="text-xs mt-1">×{service.deliveryTime[delivery]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="font-medium text-text-primary text-sm mb-3">{t('additionalServices')}:</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {service.additionalServices.map((additionalService) => (
                        <div key={additionalService.id} className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-xl border border-white/10">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-text-primary">
                              {t(additionalService.name)}
                            </span>
                            <div className="text-xs text-text-secondary">
                              {additionalService.price}₼
                              {additionalService.type === 'slider' && additionalService.unit && ` / ${t(`unit.${additionalService.unit}`)}`}
                            </div>
                          </div>
                          
                          {additionalService.type === 'slider' ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const current = additionalSelections[additionalService.id] || 0
                                  const min = additionalService.min || 0
                                  const step = additionalService.step || 1
                                  if (current > min) {
                                    updateAdditionalService(additionalService.id, current - step)
                                  }
                                }}
                                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 text-text-secondary"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium text-text-primary">
                                {additionalSelections[additionalService.id] || 0}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const current = additionalSelections[additionalService.id] || 0
                                  const max = additionalService.max || 10
                                  const step = additionalService.step || 1
                                  if (current < max) {
                                    updateAdditionalService(additionalService.id, current + step)
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
          <p className="text-3xl font-display font-bold gradient-text mb-2">
            {finalTotalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          {monthlyPayment && (
            <div className="mb-2 text-sm text-text-secondary">
              <p>{t('initialPayment')}: <span className="font-semibold text-text-primary">{initialPayment} AZN</span></p>
              <p>{t('monthly')}: <span className="font-semibold text-text-primary">{monthlyAmount} AZN × {monthlyPayment} {t('months')}</span></p>
            </div>
          )}
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
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {finalTotalPrice}
            <span className="text-base text-text-secondary font-normal ml-1">AZN</span>
          </p>
          
          {/* Monthly Payment Option */}
          <div className="mb-4 p-3 rounded-xl bg-bg-secondary/50 border border-white/10">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              {t('monthlyPaymentOption')}
            </label>
            <select
              value={monthlyPayment || ''}
              onChange={(e) => setMonthlyPayment(e.target.value ? parseInt(e.target.value) as 3 | 6 | 12 : null)}
              className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-white/10 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            >
              <option value="">{t('paymentOptions.fullPayment')}</option>
              <option value="3">{t('paymentOptions.3months')}</option>
              <option value="6">{t('paymentOptions.6months')}</option>
              <option value="12">{t('paymentOptions.12months')}</option>
            </select>
            {monthlyPayment && (
              <div className="mt-2 text-xs text-text-secondary space-y-1">
                <p>{t('initialPayment')}: <span className="font-semibold text-text-primary">{initialPayment} AZN</span> (50%)</p>
                <p>{t('monthly')}: <span className="font-semibold text-text-primary">{monthlyAmount} AZN</span> × {monthlyPayment} {t('months')}</p>
                <p className="text-green-400">{t('interestFree')}</p>
              </div>
            )}
          </div>

          <p className="text-text-muted text-[10px] mb-2">{t('taxIncluded')}</p>
          <p className="text-text-muted text-[10px] mb-4">{t('professionalTeam')}</p>
          
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
        {selectedService && (
          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <h3 className="text-text-primary font-semibold text-sm mb-3">{t('serviceRequirements')}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {t(`${selectedService}Requirements`)}
            </p>
          </div>
        )}

        {/* FAQ */}
        {selectedService && (
          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <h3 className="text-text-primary font-semibold text-sm mb-3">{t('faq')}</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
                  >
                    {t(`${selectedService}FaqQ${i}`)}
                    {openFaq === i ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                      {t(`${selectedService}FaqA${i}`)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
