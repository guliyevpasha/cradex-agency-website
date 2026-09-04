'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp, MessageCircle, Play, Clock, Zap, Camera, CheckCircle2, Rocket, FolderOpen, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Video Types ──────────────────────────────────────────────────────────────
const VIDEO_TYPES = [
  { 
    value: 'short', 
    label: 'Qısa Video Çəkiliş (Reels/Shorts)', 
    basePrice: 100,
    maxDuration: 240, // 4 hours max (in minutes)
    includedDuration: 60 // 1 hour included (in minutes)
  },
  { 
    value: 'long', 
    label: 'Uzun Video Çəkiliş (YouTube)', 
    basePrice: 200,
    maxDuration: 480, // 8 hours max (in minutes)
    includedDuration: 60 // 1 hour included (in minutes)
  }
]

// ── Additional Options ───────────────────────────────────────────────────────
const ADDITIONAL_OPTIONS = [
  { value: '4k_shooting', label: 'Peşəkar kamera ilə 4K çəkiliş', shortPrice: 20, longPrice: 30 },
  { value: 'cinematic_effects', label: 'Kinematik vizual effekt tənzimləmələri', shortPrice: 15, longPrice: 25 },
  { value: 'professional_lighting', label: 'Peşəkar işıq quruluşu', shortPrice: 20, longPrice: 30 },
  { value: 'rgb_lighting', label: 'RGB işıq effektləri', shortPrice: 15, longPrice: 25 },
  { value: 'professional_mic', label: 'Peşəkar mikrofon', shortPrice: 15, longPrice: 25 },
  { value: 'audio_setup', label: 'Səs təmizlənməsi üçün audio setup', shortPrice: 40, longPrice: 50 },
  { value: 'script_preparation', label: 'Çəkiliş ssenarisi hazırlanması', shortPrice: 35, longPrice: 45 },
  { value: 'video_planning', label: 'Video ideya planlaması', shortPrice: 20, longPrice: 30 },
  { value: 'studio_shooting', label: 'Studiyada çəkiliş', shortPrice: 70, longPrice: 80 },
  { value: 'extra_location', label: 'Əlavə məkanda çəkiliş', shortPrice: 20, longPrice: 30 },
  { value: 'same_day_shooting', label: 'Eyni gün çəkiliş', shortPrice: 40, longPrice: 50 },
  { value: 'video_editing', label: 'Çəkilmiş videoların montajı', shortPrice: 50, longPrice: 60 },
  { value: 'presenter_selection', label: 'Təqdimatçı (spiker) seçimi', shortPrice: 100, longPrice: 150 }
]

// ── File Delivery Options ────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  { value: 'google_drive', label: 'Google Drive' },
  { value: 'wetransfer', label: 'WeTransfer' },
  { value: 'ssd_flash', label: 'SSD / Flash kart' }
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'fixed' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Çəkiliş neçə gündə tamamlanır?',
    a: 'Standart çəkilişlər sifarişdən sonra 2-3 iş günü ərzində planlaşdırılır və həyata keçirilir.'
  },
  {
    q: 'Hansı avadanlıqlarla çəkiliş aparılır?',
    a: 'iPhone 17 Pro, peşəkar stabilizator, işıq quruluşu və mikrofon sistemi istifadə edilir. Əlavə ödənişlə peşəkar avadanlıqlar seçə bilərsiniz.'
  },
  {
    q: 'Çəkiliş zamanı nələr daxildir?',
    a: 'Kadr planlaması, baza işıq quruluşu, müxtəlif rakurslar və 2 ədəd 1 dəqiqəlik montajlanmış video daxildir.'
  }
]

// ── File Requirements ────────────────────────────────────────────────────────
const FILE_REQUIREMENTS = [
  'Logo və brend elementləri: SVG və ya PNG formatında',
  'Şəffaf (transparent) fon üstünlükdür',
  'Məkan ünvanı',
  'Çəkiliş məqsədi (reklam, kontent, YouTube və s.)',
  'Hədəf auditoriya məlumatı'
]

// ── Component ────────────────────────────────────────────────────────────────
export function VideoShootingCalculator() {
  const t = useTranslations('calculator.videoShooting')
  const [videoType, setVideoType] = useState(VIDEO_TYPES[0].value)
  const [duration, setDuration] = useState(60) // in minutes
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState('google_drive')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const currentVideoType = VIDEO_TYPES.find(v => v.value === videoType)!
  
  // Calculate duration price
  let durationPrice = 0
  if (duration > currentVideoType.includedDuration) {
    const extraTime = duration - currentVideoType.includedDuration
    const extraHours = Math.ceil(extraTime / 60)
    durationPrice = extraHours * (videoType === 'short' ? 25 : 35)
  }

  // Calculate additional options price
  let optionsPrice = 0
  selectedOptions.forEach(option => {
    const optionData = ADDITIONAL_OPTIONS.find(opt => opt.value === option)
    if (optionData) {
      optionsPrice += videoType === 'short' ? optionData.shortPrice : optionData.longPrice
    }
  })

  const totalPrice = currentVideoType.basePrice + durationPrice + optionsPrice

  // Apply coupon discount
  let discountAmount = 0
  let finalPrice = totalPrice
  
  if (appliedCoupon) {
    if (appliedCoupon.discount > 0) {
      discountAmount = appliedCoupon.discount
      finalPrice = totalPrice - discountAmount
    }
  }

  // Coupon application function
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
      alert('Kupon kodu yanlış!')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  // Format duration display
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours === 0) return `${minutes} ${t('minutes')}`
    if (remainingMinutes === 0) return `${hours} ${t('hours')}`
    return `${hours} ${t('hours')} ${remainingMinutes} ${t('minutes')}`
  }

  // WhatsApp message
  const whatsappNumber = '994507786887'
  const videoTypeLabel = videoType === 'short' ? t('shortVideoShooting') : t('longVideoShooting')
  const msg = encodeURIComponent(
    `Salam! ${t('title')}: ${videoTypeLabel}, ${formatDuration(duration)}. ${appliedCoupon ? `Endirim kuponu: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}Cəmi məbləğ: ${finalPrice} AZN.`
  )

  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter(item => item !== value))
    } else {
      setSelectedOptions([...selectedOptions, value])
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
      {/* ── Left: Calculator ── */}
      <div className="xl:col-span-3 space-y-4 lg:space-y-5">

        {/* Video Type Selection */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('videoType')}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {VIDEO_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setVideoType(type.value)
                  setDuration(60) // Reset to 1 hour
                }}
                className={cn(
                  'p-4 rounded-xl text-left transition-all border',
                  videoType === type.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={16} />
                  <span className="font-semibold text-sm">
                    {type.value === 'short' ? t('shortVideoShooting') : t('longVideoShooting')}
                  </span>
                </div>
                <div className="text-xs opacity-70">
                  {t('basePrice')}: {type.basePrice} AZN
                </div>
                <div className="text-xs opacity-70">
                  {t('upTo1HourIncluded')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Included Services */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <h3 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {t('includedServices')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(t.raw('basicServices')).map((key) => (
              <div key={key} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="text-green-400">•</span>
                {t(`basicServices.${key}`)}
              </div>
            ))}
          </div>
        </div>

        {/* Duration Slider */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('shootingDuration')}
          </label>
          
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-xs text-blue-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>{t('first1HourIncluded')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">+</span>
                <span>{videoType === 'short' ? t('nextHourFor25AZN') : t('nextHourFor35AZN')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-medium">
                {formatDuration(duration)}
              </span>
              <span className="text-xs text-text-muted">
                {duration > currentVideoType.includedDuration && (
                  <>+{durationPrice} AZN</>
                )}
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={currentVideoType.maxDuration}
              step={30}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>30 {t('min')}</span>
              <span>{currentVideoType.maxDuration / 60} {t('hours')}</span>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('additionalOptions')}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ADDITIONAL_OPTIONS.map((option) => {
              const isSelected = selectedOptions.includes(option.value)
              const price = videoType === 'short' ? option.shortPrice : option.longPrice
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    isSelected
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{t(`options.${option.value}`)}</span>
                  <span className="text-xs opacity-70">+{price} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* File Delivery Method */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('fileDelivery')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DELIVERY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setDeliveryMethod(option.value)}
                className={cn(
                  'p-3 rounded-xl text-sm transition-all border text-center',
                  deliveryMethod === option.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                )}
              >
                {t(`delivery.${option.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Price + CTA (mobile) */}
        <div className="xl:hidden rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-4 lg:p-5">
          <p className="text-text-muted text-xs mb-1">{t('totalAmount')}</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totalPrice} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="text-3xl font-display font-bold gradient-text mb-4">
            {finalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
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
              <p className="text-sm text-text-secondary line-through">{totalPrice} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {finalPrice}
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

        {/* File requirements */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4 shrink-0 text-accent-primary" strokeWidth={1.75} aria-hidden="true" />{t('fileRequirements')}</h3>
          <ul className="space-y-1.5">
            {Object.keys(t.raw('requirements')).map((key) => (
              <li key={key} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="text-accent-primary mt-0.5 shrink-0">•</span>
                {t(`requirements.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3 flex items-center gap-2"><HelpCircle className="w-4 h-4 shrink-0 text-accent-primary" strokeWidth={1.75} aria-hidden="true" />{t('faq')}</h3>
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