'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight, Play, Clock, Zap, CheckCircle2, Rocket, FolderOpen, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Video Types ──────────────────────────────────────────────────────────────
const VIDEO_TYPES = [
  { 
    value: 'short', 
    label: 'Qısa Video (Reels/Shorts)', 
    basePrice: 15,
    freeDuration: 60, // 1 minute free
    extraUnit: 15, // 15 seconds
    extraPrice: 3, // 3 AZN per 15 seconds
    maxDuration: 180, // 3 minutes max
    revisions: 1 // 1 revision for short videos
  },
  { 
    value: 'long', 
    label: 'Uzun Video (YouTube)', 
    basePrice: 25,
    freeDuration: 600, // 10 minutes free
    extraUnit: 300, // 5 minutes
    extraPrice: 6, // 6 AZN per 5 minutes
    maxDuration: 3600, // 60 minutes max
    revisions: 2 // 2 revisions for long videos
  }
]

// ── Basic Services (Included) ─────────────────────────────────────────────────
const BASIC_SERVICES = [
  'Kəsim və montaj',
  'Ritmə uyğun keçidlər',
  'Basic rəng düzəliş',
  'Musiqi əlavə edilməsi',
  '1080P export',
  '24 saat müddətində təhvil',
  '1 dəfə düzəliş haqqı'
]

// ── Extra Services ───────────────────────────────────────────────────────────
const SUBTITLE_OPTIONS = [
  { value: 'basic', label: 'Altyazı əlavə edilməsi', price: 2 },
  { value: 'dynamic', label: 'Dinamik altyazı (rəngli, animasiyalı)', price: 3 }
]

const SOUND_DESIGN = [
  { value: 'transitions', label: 'Keçid səsləri', price: 2 },
  { value: 'cinematic', label: 'Cinematic effectlər', price: 3 },
  { value: 'ambience', label: 'Ambience', price: 2 },
  { value: 'bass', label: 'Bass hitlər', price: 2 }
]

const MOTION_GRAPHICS = [
  { value: 'logo', label: 'Logo animasiyası', price: 15 },
  { value: 'info', label: 'Info yazıları', price: 10 }
]

const OTHER_SERVICES = [
  { value: 'color_grading', label: 'Professional rəng korreksiyası (Color Grading)', price: 5 }
]

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Video neçə gündə hazır olur?',
    a: 'Standart sifarişlər 24 saat ərzində tamamlanır. Təcili sifariş (8 saat) seçsəniz, əlavə ödəniş tələb olunur.'
  },
  {
    q: 'Hansı formatda fayl təhvil verilir?',
    a: 'Standart olaraq 1080P MP4 formatında təhvil verilir. 4K export üçün əlavə ödəniş mövcuddur.'
  },
  {
    q: 'Düzəliş hüququ varmı?',
    a: 'Bəli, hər sifarişə 1 pulsuz düzəliş daxildir. Əlavə düzəlişlər 3 AZN-dir.'
  }
]

// ── File Requirements ────────────────────────────────────────────────────────
const FILE_REQUIREMENTS = [
  'Video materiallar: MP4, MOV, AVI formatında',
  'Şəkillər: JPG, PNG (minimum 1920×1080 px)',
  'Logo: SVG və ya PNG (şəffaf arxa fon)',
  'Musiqi: MP3, WAV formatında (lisenziyalı)',
  'Mətn: Word sənədi və ya Google Docs',
  'Rəng kodu: HEX və ya RGB formatında'
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'fixed' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

// ── Component ────────────────────────────────────────────────────────────────
export function VideoEditingCalculator() {
  const t = useTranslations('calculator.videoEditing')
  const [videoType, setVideoType] = useState(VIDEO_TYPES[0].value)
  const [duration, setDuration] = useState(60) // seconds for short, seconds for long
  const [subtitles, setSubtitles] = useState<string[]>([])
  const [soundDesign, setSoundDesign] = useState<string[]>([])
  const [motionGraphics, setMotionGraphics] = useState<string[]>([])
  const [otherServices, setOtherServices] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState(false)
  const [fastDelivery, setFastDelivery] = useState(false)
  const [export4K, setExport4K] = useState(false)
  const [presenter, setPresenter] = useState(false)
  const [shortsFromLong, setShortsFromLong] = useState(0) // only for long videos
  const [extraRevisions, setExtraRevisions] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const currentVideoType = VIDEO_TYPES.find(v => v.value === videoType)!
  
  // Calculate duration price
  let durationPrice = 0
  if (duration > currentVideoType.freeDuration) {
    const extraTime = duration - currentVideoType.freeDuration
    const extraUnits = Math.ceil(extraTime / currentVideoType.extraUnit)
    durationPrice = extraUnits * currentVideoType.extraPrice
  }

  // Calculate extra services price
  let extrasPrice = 0
  
  // Subtitles
  subtitles.forEach(sub => {
    const option = SUBTITLE_OPTIONS.find(s => s.value === sub)
    if (option) extrasPrice += option.price
  })
  
  // Sound Design
  soundDesign.forEach(sound => {
    const option = SOUND_DESIGN.find(s => s.value === sound)
    if (option) extrasPrice += option.price
  })
  
  // Motion Graphics
  motionGraphics.forEach(motion => {
    const option = MOTION_GRAPHICS.find(m => m.value === motion)
    if (option) extrasPrice += option.price
  })
  
  // Other Services
  otherServices.forEach(service => {
    const option = OTHER_SERVICES.find(s => s.value === service)
    if (option) extrasPrice += option.price
  })
  
  // Thumbnail
  if (thumbnail) {
    extrasPrice += videoType === 'short' ? 3 : 10
  }
  
  // Fast delivery
  if (fastDelivery) {
    extrasPrice += videoType === 'short' ? 5 : 10
  }
  
  // 4K export
  if (export4K) {
    extrasPrice += videoType === 'short' ? 2 : 4
  }
  
  // Presenter selection
  if (presenter) {
    extrasPrice += videoType === 'short' ? 100 : 150
  }
  
  // Shorts from long video (only for long videos)
  if (videoType === 'long' && shortsFromLong > 0) {
    extrasPrice += shortsFromLong * 5
  }
  
  // Extra revisions
  if (extraRevisions > 0) {
    extrasPrice += extraRevisions * 3
  }

  const totalPrice = currentVideoType.basePrice + durationPrice + extrasPrice

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
      alert(t('invalidCoupon'))
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  // Format duration display
  const formatDuration = (seconds: number) => {
    if (videoType === 'short') {
      if (seconds < 60) return `${seconds} ${t('seconds')}`
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes} ${t('min')} ${remainingSeconds} ${t('sec')}` : `${minutes} ${t('minutes')}`
    } else {
      const minutes = Math.floor(seconds / 60)
      return `${minutes} ${t('minutes')}`
    }
  }

  // WhatsApp message
  const whatsappNumber = '994507786887'
  const videoTypeLabel = videoType === 'short' ? t('shortVideo') : t('longVideo')
  const msg = encodeURIComponent(
    `${t('faqA1').split('.')[0]}! ${t('title')}: ${videoTypeLabel}, ${formatDuration(duration)}. ${appliedCoupon ? `${t('discountCoupon')}: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}${t('totalAmount')}: ${finalPrice} AZN.`
  )

  const toggleArrayValue = (array: string[], setter: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value))
    } else {
      setter([...array, value])
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIDEO_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setVideoType(type.value)
                  setDuration(type.freeDuration) // Reset to free duration
                  setShortsFromLong(0) // Reset shorts from long
                }}
                className={cn(
                  'p-4 rounded-xl text-left transition-all border',
                  videoType === type.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {type.value === 'short' ? <Play size={16} /> : <Clock size={16} />}
                  <span className="font-semibold text-sm">
                    {type.value === 'short' ? t('shortVideo') : t('longVideo')}
                  </span>
                </div>
                <div className="text-xs opacity-70">
                  {t('basePrice')}: {type.basePrice} AZN
                </div>
                <div className="text-xs opacity-70">
                  {type.value === 'short' ? t('firstMinuteFree') : t('first10MinFree')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Services (Included) */}
        <div key={`basic-services-${videoType}`} className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <h3 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {t('includedServices')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(t.raw('basicServices')).filter(key => {
              // Filter out revision keys that don't match current video type
              if (key === 'oneRevision' && currentVideoType.revisions !== 1) return false;
              if (key === 'twoRevisions' && currentVideoType.revisions !== 2) return false;
              return true;
            }).map((key) => (
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
            {t('videoDuration')}
          </label>
          
          {/* Pricing Info */}
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-xs text-blue-300 space-y-1">
              {videoType === 'short' ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{t('firstMinuteFree')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">+</span>
                    <span>{t('next15SecFor3AZN')}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{t('first10MinFree')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">+</span>
                    <span>{t('next5MinFor6AZN')}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-medium">
                {formatDuration(duration)}
              </span>
              <span className="text-xs text-text-muted">
                {duration > currentVideoType.freeDuration && (
                  <>+{durationPrice} AZN</>
                )}
              </span>
            </div>
            <input
              type="range"
              min={videoType === 'short' ? 15 : 300}
              max={currentVideoType.maxDuration}
              step={videoType === 'short' ? 15 : 300}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>{videoType === 'short' ? `15 ${t('sec')}` : `5 ${t('min')}`}</span>
              <span>{videoType === 'short' ? `3 ${t('min')}` : `60 ${t('min')}`}</span>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('subtitleOptions')}
          </label>
          <div className="space-y-2">
            {SUBTITLE_OPTIONS.map((option) => {
              const isSelected = subtitles.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggleArrayValue(subtitles, setSubtitles, option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    isSelected
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{option.value === 'basic' ? t('basicSubtitle') : t('dynamicSubtitle')}</span>
                  <span className="text-xs opacity-70">+{option.price} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Sound Design */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('soundDesign')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOUND_DESIGN.map((option) => {
              const isSelected = soundDesign.includes(option.value)
              const labelKey = {
                'transitions': 'transitionSounds',
                'cinematic': 'cinematicEffects', 
                'ambience': 'ambience',
                'bass': 'bassHits'
              }[option.value] || option.value
              return (
                <button
                  key={option.value}
                  onClick={() => toggleArrayValue(soundDesign, setSoundDesign, option.value)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    isSelected
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{t(labelKey)}</span>
                  <span className="text-xs opacity-70">+{option.price} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Motion Graphics */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('motionGraphics')}
          </label>
          <div className="space-y-2">
            {MOTION_GRAPHICS.map((option) => {
              const isSelected = motionGraphics.includes(option.value)
              const labelKey = option.value === 'logo' ? 'logoAnimation' : 'infoTexts'
              return (
                <button
                  key={option.value}
                  onClick={() => toggleArrayValue(motionGraphics, setMotionGraphics, option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    isSelected
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{t(labelKey)}</span>
                  <span className="text-xs opacity-70">+{option.price} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Other Services */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('otherServices')}
          </label>
          <div className="space-y-2">
            {OTHER_SERVICES.map((option) => {
              const isSelected = otherServices.includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggleArrayValue(otherServices, setOtherServices, option.value)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    isSelected
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{t('colorGrading')}</span>
                  <span className="text-xs opacity-70">+{option.price} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('additionalOptions')}
          </label>
          <div className="space-y-3">
            {/* Thumbnail */}
            <button
              onClick={() => setThumbnail(!thumbnail)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                thumbnail
                  ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('thumbnailCreation')}</span>
              <span className="text-xs opacity-70">+{videoType === 'short' ? 3 : 10} AZN</span>
            </button>

            {/* Fast Delivery */}
            <button
              onClick={() => setFastDelivery(!fastDelivery)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                fastDelivery
                  ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span className="flex items-center gap-2">
                <Zap size={16} />
                {t('fastDelivery8h')}
              </span>
              <span className="text-xs opacity-70">+{videoType === 'short' ? 5 : 10} AZN</span>
            </button>

            {/* 4K Export */}
            <button
              onClick={() => setExport4K(!export4K)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                export4K
                  ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('export4K')}</span>
              <span className="text-xs opacity-70">+{videoType === 'short' ? 2 : 4} AZN</span>
            </button>

            {/* Presenter Selection */}
            <button
              onClick={() => setPresenter(!presenter)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                presenter
                  ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('presenterSelection')}</span>
              <span className="text-xs opacity-70">+{videoType === 'short' ? 100 : 150} AZN</span>
            </button>
          </div>
        </div>

        {/* Shorts from Long Video (only for long videos) */}
        {videoType === 'long' && (
          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
              {t('shortsFromLong')}
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary font-medium">
                  {shortsFromLong} {t('shortsCount')}
                </span>
                <span className="text-xs text-text-muted">
                  {shortsFromLong > 0 && <>+{shortsFromLong * 5} AZN</>}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={shortsFromLong}
                onChange={(e) => setShortsFromLong(Number(e.target.value))}
                className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>0 {t('shortsCount')}</span>
                <span>10 {t('shortsCount')}</span>
              </div>
              <p className="text-xs text-text-muted">
                {t('per1MinShort')}
              </p>
            </div>
          </div>
        )}

        {/* Extra Revisions */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('extraRevisions')}
          </label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-medium">
                {extraRevisions} {t('extraRevision')}
              </span>
              <span className="text-xs text-text-muted">
                {extraRevisions > 0 && <>+{extraRevisions * 3} AZN</>}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={extraRevisions}
              onChange={(e) => setExtraRevisions(Number(e.target.value))}
              className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>0</span>
              <span>5</span>
            </div>
            <p className="text-xs text-text-muted">
              {t('perExtraRevision')}
            </p>
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
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('videoMaterials')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('images')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('logo')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('music')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('text')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('colorCode')}
            </li>
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