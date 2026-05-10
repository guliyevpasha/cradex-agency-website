'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Smartphone, Plus, Minus, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Mobile App Feature Types ─────────────────────────────────────────────────
interface MobileAppFeature {
  id: string
  name: string
  price: number
  included: boolean
}

// ── Mobile App Features Data ─────────────────────────────────────────────────
const MOBILE_APP_FEATURES: MobileAppFeature[] = [
  { id: 'pushNotifications', name: 'additionalFeaturesList.pushNotifications', price: 0, included: true },
  { id: 'offlineMode', name: 'additionalFeaturesList.offlineMode', price: 425, included: false },
  { id: 'biometricLogin', name: 'additionalFeaturesList.biometricLogin', price: 255, included: false },
  { id: 'inAppPurchase', name: 'additionalFeaturesList.inAppPurchase', price: 680, included: false },
  { id: 'socialLogin', name: 'additionalFeaturesList.socialLogin', price: 0, included: true },
  { id: 'cameraIntegration', name: 'additionalFeaturesList.cameraIntegration', price: 340, included: false },
  { id: 'geolocation', name: 'additionalFeaturesList.geolocation', price: 305, included: false },
  { id: 'chatFeature', name: 'additionalFeaturesList.chatFeature', price: 510, included: false },
  { id: 'cloudSync', name: 'additionalFeaturesList.cloudSync', price: 425, included: false },
  { id: 'appAnalytics', name: 'additionalFeaturesList.appAnalytics', price: 0, included: true },
  { id: 'appStoreSetup', name: 'additionalFeaturesList.appStoreSetup', price: 510, included: false },
  { id: 'googlePlaySetup', name: 'additionalFeaturesList.googlePlaySetup', price: 510, included: false },
  { id: 'appUpdatesYearly', name: 'additionalFeaturesList.appUpdatesYearly', price: 850, included: false },
]

// ── Support Packages ─────────────────────────────────────────────────────────
const SUPPORT_PACKAGES = [
  { id: 'basic', name: 'supportPackages.basic', price: 0 },
  { id: 'premium', name: 'supportPackages.premium', price: 2500 },
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'percentage' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

export default function MobileAppCalculator() {
  const t = useTranslations('calculator.mobileApp')
  
  const BASE_PRICE = 6000
  const PREMIUM_DESIGN_PRICE = 2550
  
  const [screenCount, setScreenCount] = useState(5)
  const [designType, setDesignType] = useState<'custom' | 'premium'>('custom')
  const [supportPackage, setSupportPackage] = useState<string>('basic')
  const [monthlyPayment, setMonthlyPayment] = useState<3 | 6 | 12 | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({
    pushNotifications: true,
    socialLogin: true,
    appAnalytics: true,
  })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const toggleFeature = (featureId: string) => {
    const feature = MOBILE_APP_FEATURES.find(f => f.id === featureId)
    if (feature && !feature.included) {
      setSelectedFeatures(prev => ({
        ...prev,
        [featureId]: !prev[featureId]
      }))
    }
  }

  const calculateTotal = () => {
    let total = BASE_PRICE

    // Add design price
    if (designType === 'premium') {
      total += PREMIUM_DESIGN_PRICE
    }

    // Add selected features
    MOBILE_APP_FEATURES.forEach(feature => {
      if (selectedFeatures[feature.id] && !feature.included) {
        total += feature.price
      }
    })

    return Math.round(total)
  }

  const totalPrice = calculateTotal()

  // Apply coupon discount
  let discountAmount = 0
  let finalTotalPrice = totalPrice
  
  if (appliedCoupon) {
    if (appliedCoupon.discount > 0) {
      discountAmount = appliedCoupon.discount
      finalTotalPrice = totalPrice - discountAmount
    }
  }

  // Support package yearly price (only for premium)
  const supportYearlyPrice = supportPackage === 'premium' ? 2500 : 0

  // Monthly payment calculation (only for base price, not support)
  const initialPayment = monthlyPayment ? Math.round(finalTotalPrice * 0.5) : 0
  const monthlyAmount = monthlyPayment ? Math.round((finalTotalPrice - initialPayment) / monthlyPayment) : 0

  // Coupon application
  const applyCoupon = () => {
    const coupon = COUPON_CODES.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (coupon) {
      let discount = 0
      if (coupon.type === 'percentage') {
        discount = Math.round((totalPrice * coupon.discount) / 100)
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
  
  const msg = encodeURIComponent(
    `Salam! ${t('title')}: ${screenCount} ${t('screens')}. ${t('designComplexity')}: ${t(`designOptions.${designType}`)}. ${t('supportPackage')}: ${t(SUPPORT_PACKAGES.find(p => p.id === supportPackage)?.name || '')}${supportYearlyPrice > 0 ? ` (${supportYearlyPrice} AZN/${t('yearly')})` : ''}. ${appliedCoupon ? `${t('discountCoupon')}: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}${t('totalAmount')}: ${finalTotalPrice} AZN.${monthlyPayment ? ` ${t('monthlyPayment')}: ${monthlyPayment} ${t('months')} (${t('initialPayment')}: ${initialPayment} AZN, ${t('monthly')}: ${monthlyAmount} AZN)` : ''}`
  )

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
      {/* ── Left: Calculator ── */}
      <div className="xl:col-span-3 space-y-4 lg:space-y-5">

        {/* Main Card */}
        <motion.div
          className="rounded-2xl border border-accent-primary/60 bg-accent-primary/5 p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-xl text-accent-primary bg-accent-primary/10">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">{t('title')}</h3>
              <p className="text-text-secondary text-sm">{t('basePrice')}: {BASE_PRICE} AZN</p>
            </div>
          </div>

          {/* Screen Count Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-medium text-text-primary text-sm">{t('screenCount')}:</label>
              <span className="text-accent-primary font-bold text-lg">{screenCount} {t('screens')}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={screenCount}
              onChange={(e) => setScreenCount(parseInt(e.target.value))}
              className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent-primary"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>5</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Included Services - MOVED ABOVE DESIGN COMPLEXITY */}
          <div className="mb-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <h4 className="font-medium text-green-400 text-sm mb-3 flex items-center gap-2">
              ✅ {t('includedServices')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'includedItems.freeDomainHosting',
                'includedItems.support247',
                'includedItems.warranty',
                'includedItems.pushNotifications',
                'includedItems.socialLogin',
                'includedItems.appAnalytics',
              ].map((item, index) => (
                <div key={index} className="flex items-center text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 shrink-0"></span>
                  {t(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Design Complexity */}
          <div className="mb-6">
            <h4 className="font-medium text-text-primary text-sm mb-3">{t('designComplexity')}:</h4>
            <div className="grid grid-cols-2 gap-3">
              {(['custom', 'premium'] as const).map((design) => (
                <button
                  key={design}
                  onClick={() => setDesignType(design)}
                  className={cn(
                    'p-4 rounded-xl border text-center transition-all',
                    designType === design
                      ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                      : 'border-white/10 bg-bg-tertiary/50 text-text-secondary hover:border-white/25'
                  )}
                >
                  <div className="text-sm font-medium">{t(`designOptions.${design}`)}</div>
                  {design === 'premium' && (
                    <div className="text-xs mt-1">+{PREMIUM_DESIGN_PRICE} AZN</div>
                  )}
                  {design === 'custom' && (
                    <div className="text-xs mt-1 text-green-400">{t('free')}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Support Package */}
          <div className="mb-6">
            <h4 className="font-medium text-text-primary text-sm mb-3">{t('supportPackage')}:</h4>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORT_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSupportPackage(pkg.id)}
                  className={cn(
                    'p-3 rounded-xl border text-center transition-all',
                    supportPackage === pkg.id
                      ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                      : 'border-white/10 bg-bg-tertiary/50 text-text-secondary hover:border-white/25'
                  )}
                >
                  <div className="text-sm font-medium">{t(pkg.name)}</div>
                  <div className="text-xs mt-1">
                    {pkg.price === 0 ? (
                      <span className="text-green-400">{t('free')}</span>
                    ) : (
                      <span>{pkg.price} AZN/{t('yearly')}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Support Package Details */}
            {supportPackage && (
              <div className="mt-3 p-3 rounded-xl bg-bg-secondary/50 border border-white/10">
                <div className="space-y-1.5">
                  {supportPackage === 'basic' && (
                    <>
                      {(t.raw('basicSupportDetails') as string[]).map((detail, index) => (
                        <div key={index} className="flex items-start text-xs text-text-secondary">
                          <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-2 mt-1.5 shrink-0"></span>
                          {detail}
                        </div>
                      ))}
                    </>
                  )}
                  {supportPackage === 'premium' && (
                    <>
                      {(t.raw('premiumSupportDetails') as string[]).map((detail, index) => (
                        <div key={index} className="flex items-start text-xs text-text-secondary">
                          <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-2 mt-1.5 shrink-0"></span>
                          {detail}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Features */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="font-medium text-text-primary text-sm mb-3">{t('additionalFeatures')}:</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {MOBILE_APP_FEATURES.map((feature) => (
                <div 
                  key={feature.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border transition-all",
                    feature.included 
                      ? "bg-green-500/5 border-green-500/20 cursor-not-allowed opacity-60"
                      : "bg-bg-tertiary/50 border-white/10 cursor-pointer hover:border-white/25"
                  )}
                  onClick={() => !feature.included && toggleFeature(feature.id)}
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-text-primary">
                      {t(feature.name)}
                    </span>
                    <div className="text-xs text-text-secondary">
                      {feature.included ? (
                        <span className="text-green-400">{t('included')}</span>
                      ) : (
                        <span>{feature.price} AZN</span>
                      )}
                    </div>
                  </div>
                  
                  <label className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedFeatures[feature.id] || feature.included}
                      disabled={feature.included}
                      onChange={() => toggleFeature(feature.id)}
                      className="w-4 h-4 text-accent-primary border-white/20 rounded focus:ring-accent-primary bg-transparent disabled:opacity-50"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Price + CTA (mobile) */}
        <div className="xl:hidden rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-4 lg:p-5">
          <p className="text-text-muted text-xs mb-1">{t('totalAmount')}</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totalPrice} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="text-3xl font-display font-bold gradient-text mb-2">
            {finalTotalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          {supportYearlyPrice > 0 && (
            <p className="text-sm text-text-secondary mb-2">
              + {supportYearlyPrice} AZN/{t('yearly')} ({t('supportPackage')})
            </p>
          )}
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
              <p className="text-sm text-text-secondary line-through">{totalPrice} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {finalTotalPrice}
            <span className="text-base text-text-secondary font-normal ml-1">AZN</span>
          </p>
          
          {supportYearlyPrice > 0 && (
            <p className="text-sm text-text-secondary mb-3">
              + {supportYearlyPrice} AZN/{t('yearly')} ({t('supportPackage')})
            </p>
          )}

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
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">{t('serviceRequirements')}</h3>
          <div className="space-y-2">
            {[
              'requirementsList.appIdea',
              'requirementsList.targetAudience',
              'requirementsList.designPreferences',
              'requirementsList.contentMaterials',
              'requirementsList.apiDocumentation',
              'requirementsList.accountCredentials',
            ].map((item, index) => (
              <div key={index} className="flex items-start text-xs text-text-secondary">
                <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-2 mt-1.5 shrink-0"></span>
                {t(item)}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">{t('faq')}</h3>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
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
