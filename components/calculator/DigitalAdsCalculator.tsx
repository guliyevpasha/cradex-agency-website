'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Search, Video, Linkedin, Plus, Minus, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
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
    name: 'Meta Reklamları (Facebook & Instagram)',
    price: 350,
    icon: <Facebook className="w-6 h-6" />,
    description: 'Facebook və Instagram reklamları',
    includes: [
      'Meta Business Manager qurulması',
      'Reklam hesabının yaradılması',
      'Pixel bağlantısı',
      '1 reklam kampaniyası',
      'Auditoriya hədəflənməsi',
      '3 reklam kreativi (video və ya şəkil)',
      'Reklam mətnlərinin yazılması',
      'Gündəlik optimizasiya',
      'Aylıq hesabat'
    ],
    additionalServices: [
      { id: 'meta_campaign', name: 'Əlavə reklam kampaniyası', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'meta_creative', name: 'Əlavə reklam kreativi', price: 25, type: 'slider', min: 1, max: 10 },
      { id: 'meta_reels', name: 'Reels montajı', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'meta_motion', name: 'Motion dizayn reklamı', price: 70, type: 'slider', min: 1, max: 10 },
      { id: 'meta_text', name: 'Reklam üçün mətn yazılması', price: 30, type: 'slider', min: 1, max: 10 },
      { id: 'meta_pixel', name: 'Meta Pixel qurulması', price: 120, type: 'fixed' },
      { id: 'meta_api', name: 'Conversion API inteqrasiyası', price: 180, type: 'fixed' },
      { id: 'meta_dm', name: 'DM cavablandırma xidməti', price: 250, type: 'monthly' },
      { id: 'meta_influencer', name: 'Influencer əməkdaşlıqlarının idarəsi', price: 150, type: 'fixed' },
      { id: 'meta_ab', name: 'A/B test optimizasiyası', price: 100, type: 'fixed' }
    ]
  },
  {
    id: 'google',
    name: 'Google Reklamları',
    price: 450,
    icon: <Search className="w-6 h-6" />,
    description: 'Google Ads və Search reklamları',
    includes: [
      'Google Ads hesabının qurulması',
      'Search reklam kampaniyası',
      'Açar söz araşdırması',
      'Mənfi açar söz optimizasiyası',
      '2 reklam qrupu',
      'Reklam mətnlərinin hazırlanması',
      'Conversion tracking',
      'Aylıq optimizasiya və hesabat'
    ],
    additionalServices: [
      { id: 'google_banner', name: 'Display reklam bannerləri', price: 40, type: 'slider', min: 1, max: 10 },
      { id: 'google_tag', name: 'Google Tag Manager qurulması', price: 120, type: 'fixed' },
      { id: 'google_conversion', name: 'Conversion tracking', price: 150, type: 'fixed' },
      { id: 'google_analytics', name: 'Google Analytics 4 inteqrasiyası', price: 180, type: 'fixed' },
      { id: 'google_youtube', name: 'YouTube reklam setup', price: 250, type: 'fixed' },
      { id: 'google_remarketing', name: 'Remarketing kampaniyası', price: 140, type: 'fixed' },
      { id: 'google_keywords', name: 'Açar söz araşdırması (geniş)', price: 100, type: 'fixed' },
      { id: 'google_landing', name: 'Landing page analizi', price: 150, type: 'fixed' },
      { id: 'google_seo', name: 'SEO audit', price: 300, type: 'fixed' }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok Reklamları',
    price: 400,
    icon: <Video className="w-6 h-6" />,
    description: 'TikTok Ads və video reklamları',
    includes: [
      'TikTok Ads hesabının qurulması',
      'Pixel inteqrasiyası',
      '1 reklam kampaniyası',
      'Auditoriya analizi',
      '3 video kreativ',
      'Reklam optimizasiyası',
      'Aylıq hesabat'
    ],
    additionalServices: [
      { id: 'tiktok_video', name: 'TikTok video montajı', price: 50, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_ugc', name: 'UGC kontent ssenarisi', price: 80, type: 'slider', min: 1, max: 10 },
      { id: 'tiktok_viral', name: 'Viral kontent planlaması', price: 120, type: 'fixed' },
      { id: 'tiktok_pixel', name: 'TikTok Pixel qurulması', price: 120, type: 'fixed' },
      { id: 'tiktok_creator', name: 'Creator/influencer tapılması', price: 150, type: 'fixed' },
      { id: 'tiktok_trend', name: 'Trend araşdırması', price: 70, type: 'fixed' },
      { id: 'tiktok_shop', name: 'TikTok shop inteqrasiyası', price: 250, type: 'fixed' }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Reklamları',
    price: 500,
    icon: <Linkedin className="w-6 h-6" />,
    description: 'LinkedIn B2B reklamları',
    includes: [
      'LinkedIn Campaign Manager qurulması',
      'B2B auditoriya hədəflənməsi',
      'Potensial Müştəri Toplama Kampaniyası',
      'Sponsorlu post reklamları',
      'Reklam mətnlərinin hazırlanması',
      'Aylıq optimizasiya',
      'Hesabat təqdimatı'
    ],
    additionalServices: [
      { id: 'linkedin_optimization', name: 'LinkedIn şirkət səhifəsinin optimizasiyası', price: 180, type: 'fixed' },
      { id: 'linkedin_b2b', name: 'B2B Potensial Müştəri Strategiyası', price: 250, type: 'fixed' },
      { id: 'linkedin_text', name: 'Korporativ mətn', price: 50, type: 'fixed' },
      { id: 'linkedin_employer', name: 'Şirkətin İşəgötürən İmic Strategiyası', price: 400, type: 'fixed' },
      { id: 'linkedin_form', name: 'Potensial Müştəri Formasının Qurulması', price: 120, type: 'fixed' },
      { id: 'linkedin_ceo', name: 'CEO Şəxsi Brend İdarəçiliyi', price: 500, type: 'monthly' },
      { id: 'linkedin_content', name: 'LinkedIn kontent planı', price: 200, type: 'fixed' }
    ]
  }
]

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Reklam kampaniyası neçə gündə başlayır?',
    a: 'Reklam kampaniyaları 24-48 saat ərzində başlayır. Təcili kampaniyalar üçün əlavə ödəniş tələb olunur.'
  },
  {
    q: 'Reklam büdcəsi nə qədər olmalıdır?',
    a: 'Minimum reklam büdcəsi günlük 10 AZN-dir. Optimal nəticələr üçün günlük 30-50 AZN tövsiyə edirik.'
  },
  {
    q: 'Nəticələri necə izləyə bilərəm?',
    a: 'Aylıq hesabat və real-vaxt statistika təqdim edirik. Həmçinin WhatsApp vasitəsilə günlük yeniliklər göndəririk.'
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
    let total = 0
    let monthlyTotal = 0

    // Əsas xidmətlər
    selectedServices.forEach(serviceId => {
      const service = AD_SERVICES.find(s => s.id === serviceId)
      if (service) {
        monthlyTotal += service.price
      }
    })

    // Əlavə xidmətlər
    Object.entries(additionalSelections).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        AD_SERVICES.forEach(service => {
          const additionalService = service.additionalServices.find(as => as.id === serviceId)
          if (additionalService) {
            if (additionalService.type === 'monthly') {
              monthlyTotal += additionalService.price * quantity
            } else {
              total += additionalService.price * quantity
            }
          }
        })
      }
    })

    return { oneTime: total, monthly: monthlyTotal }
  }

  const totals = calculateTotal()

  // Apply coupon discount
  let discountAmount = 0
  let finalPrice = totals.monthly
  
  if (appliedCoupon) {
    if (appliedCoupon.discount > 0) {
      discountAmount = appliedCoupon.discount
      finalPrice = totals.monthly - discountAmount
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
      alert('Endirim kodu yanlışdır!')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  // WhatsApp message
  const whatsappNumber = '994507786887'
  const selectedServiceNames = selectedServices.map(id => {
    const service = AD_SERVICES.find(s => s.id === id)
    return service?.name
  }).join(', ')
  
  const msg = encodeURIComponent(
    `Salam! Rəqəmsal Reklam Kalkulyatoru: ${selectedServiceNames}. ${appliedCoupon ? `Endirim kodu: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}Ümumi məbləğ: ${finalPrice} AZN (aylıq).`
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
                      {service.name}
                    </h3>
                    <p className="text-text-secondary text-sm">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'text-xl font-bold',
                    selectedServices.includes(service.id) ? 'text-accent-primary' : 'text-text-primary'
                  )}>
                    {service.price}₼
                  </div>
                  <div className="text-xs text-text-muted">aylıq</div>
                </div>
              </div>

              {/* Included Services */}
              <div className="mb-4 p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                <h4 className="font-medium text-green-400 text-xs mb-2 flex items-center gap-2">
                  ✅ Daxil olan xidmətlər
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {service.includes.map((item, index) => (
                    <div key={index} className="flex items-center text-xs text-text-secondary">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 shrink-0"></span>
                      {item}
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
                  <h4 className="font-medium text-text-primary text-sm mb-3">Əlavə Xidmətlər:</h4>
                  <div className="space-y-2">
                    {service.additionalServices.map((additionalService) => (
                      <div key={additionalService.id} className="flex items-center justify-between p-3 bg-bg-tertiary/50 rounded-xl border border-white/10">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-text-primary">
                            {additionalService.name}
                          </span>
                          <div className="text-xs text-text-secondary">
                            {additionalService.price}₼
                            {additionalService.type === 'monthly' && ' / aylıq'}
                            {additionalService.type === 'slider' && ' / ədəd'}
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
                          <label className="flex items-center">
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
          <p className="text-text-muted text-xs mb-1">Ümumi məbləğ</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totals.monthly} AZN</p>
              <p className="text-xs text-green-400">Endirim: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="text-3xl font-display font-bold gradient-text mb-4">
            {finalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          <p className="text-text-muted text-[10px] mb-4">aylıq ödəniş</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm"
          >
            <MessageCircle size={16} />
            İndi Sifariş Ver
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
          <p className="text-text-muted text-xs mb-1">Ümumi məbləğ</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totals.monthly} AZN</p>
              <p className="text-xs text-green-400">Endirim: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {finalPrice}
            <span className="text-base text-text-secondary font-normal ml-1">AZN</span>
          </p>
          <p className="text-text-muted text-[10px] mb-2">aylıq ödəniş</p>
          <p className="text-text-muted text-[10px] mb-4">Peşəkar komanda ilə</p>
          
          {/* Coupon Section */}
          <div className="mb-4 p-3 rounded-xl bg-bg-secondary/50 border border-white/10">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              Endirim Kodu
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-400 font-medium">{appliedCoupon.code}</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Ləğv et
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Endirim kodunu daxil edin"
                  className="flex-1 px-3 py-2 rounded-lg bg-bg-tertiary border border-white/10 text-text-primary text-xs placeholder-text-muted focus:border-accent-primary focus:outline-none"
                />
                <button
                  onClick={applyCoupon}
                  disabled={!couponCode.trim()}
                  className="px-3 py-2 rounded-lg bg-accent-primary text-white text-xs font-medium hover:bg-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Tətbiq et
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
              İndi Sifariş Ver
            </a>
          </div>
        </div>

        {/* Service Requirements */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">Xidmət Tələbləri</h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Şirkət məlumatları və logo
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Hədəf auditoriya məlumatları
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Məhsul/xidmət şəkilləri
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Reklam büdcəsi (minimum 300 AZN/ay)
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Veb sayt və ya landing page
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              Əlaqə məlumatları və sosial media hesabları
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">Tez-tez Verilən Suallar</h3>
          <div className="space-y-2">
            {FAQ.map((faq, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                    {faq.a}
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