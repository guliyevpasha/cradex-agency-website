'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight, Instagram, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Platform data with design types ──────────────────────────────────────────
interface DesignType {
  value: string
  label: string
  price: number
  note?: string
}

interface Platform {
  value: string
  label: string
  icon: string
  designs: DesignType[]
}

const PLATFORMS: Platform[] = [
  {
    value: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    designs: [
      { value: 'content', label: '', price: 15 },
      { value: 'reels_cover', label: '', price: 10 },
      { value: 'story', label: '', price: 8 },
      { value: 'highlights', label: '', price: 5 },
      { value: 'carousel', label: '', price: 40, note: '' },
    ]
  },
  {
    value: 'facebook',
    label: 'Facebook',
    icon: 'Facebook',
    designs: [
      { value: 'post', label: '', price: 12 },
      { value: 'ad', label: '', price: 15 },
      { value: 'event_cover', label: '', price: 18 },
      { value: 'cover', label: '', price: 10 },
    ]
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: 'Linkedin',
    designs: [
      { value: 'post', label: '', price: 15 },
      { value: 'banner', label: '', price: 20 },
      { value: 'article_cover', label: '', price: 18 },
      { value: 'single_ad', label: '', price: 16 },
    ]
  },
  {
    value: 'pinterest',
    label: 'Pinterest',
    icon: 'Pin',
    designs: [
      { value: 'carousel_ad', label: '', price: 20, note: '' },
      { value: 'pin', label: '', price: 12 },
    ]
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    icon: 'Music',
    designs: [
      { value: 'video_cover', label: '', price: 10 },
    ]
  },
  {
    value: 'youtube',
    label: 'YouTube',
    icon: 'Youtube',
    designs: [
      { value: 'channel_cover', label: '', price: 25 },
      { value: 'thumbnail', label: '', price: 12 },
    ]
  },
  {
    value: 'twitter',
    label: 'X (Twitter)',
    icon: 'Twitter',
    designs: [
      { value: 'cover', label: '', price: 12 },
      { value: 'content', label: '', price: 14 },
    ]
  },
]

// ── Additional services ──────────────────────────────────────────────────────
const ADDITIONAL_SERVICES = [
  { value: 'custom_icons', label: '', price: 3 },
  { value: 'copywriting', label: '', price: 10 },
  { value: 'template_files', label: '', price: 20 },
  { value: 'rush_delivery', label: '', price: 10 },
]

// ── Coupon Codes ─────────────────────────────────────────────────────────────
const COUPON_CODES = [
  { code: 'CRADEX10', discount: 10, type: 'percentage' as const },
  { code: 'YENI20', discount: 20, type: 'percentage' as const },
  { code: 'ENDIRIM15', discount: 15, type: 'fixed' as const },
  { code: 'FIRST25', discount: 25, type: 'percentage' as const },
]

// ── FAQ ───────────────────────────────────────────────────────────────────────
// FAQ will be loaded from translations

// ── File requirements ─────────────────────────────────────────────────────────
// File requirements will be loaded from translations

// ── Component ─────────────────────────────────────────────────────────────────
export function SocialMediaDesignCalculator() {
  const t = useTranslations('calculator.socialMediaDesign')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [selectedDesigns, setSelectedDesigns] = useState<{[platform: string]: {[design: string]: boolean}}>({
    instagram: { content: true }
  })
  const [designCount, setDesignCount] = useState(1)
  const [additionalServices, setAdditionalServices] = useState<string[]>([])
  const [extraRevisions, setExtraRevisions] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  // Render platform icon
  const renderPlatformIcon = (iconName: string) => {
    const iconProps = { size: 20, className: "text-current" }
    
    switch (iconName) {
      case 'Instagram':
        return <Instagram {...iconProps} />
      case 'Facebook':
        return <Facebook {...iconProps} />
      case 'Linkedin':
        return <Linkedin {...iconProps} />
      case 'Youtube':
        return <Youtube {...iconProps} />
      case 'Twitter':
        return (
          <div className="w-5 h-5 rounded border border-current flex items-center justify-center text-current text-xs font-bold">
            X
          </div>
        )
      case 'Pin':
        return (
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-current text-xs font-bold">
            P
          </div>
        )
      case 'Music':
        return (
          <div className="w-5 h-5 rounded border border-current flex items-center justify-center text-current text-xs font-bold">
            ♪
          </div>
        )
      default:
        return <div className="w-5 h-5 rounded bg-gray-500"></div>
    }
  }

  // Handle platform selection
  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      // Remove platform
      const newPlatforms = selectedPlatforms.filter(p => p !== platform)
      setSelectedPlatforms(newPlatforms)
      
      // Remove designs for this platform
      const newDesigns = { ...selectedDesigns }
      delete newDesigns[platform]
      setSelectedDesigns(newDesigns)
    } else {
      // Add platform
      setSelectedPlatforms([...selectedPlatforms, platform])
      
      // Add first design for this platform
      const platformData = PLATFORMS.find(p => p.value === platform)
      if (platformData && platformData.designs.length > 0) {
        setSelectedDesigns({
          ...selectedDesigns,
          [platform]: { [platformData.designs[0].value]: true }
        })
      }
    }
  }

  // Handle design selection within platform
  const handleDesignToggle = (platform: string, design: string) => {
    const newDesigns = { ...selectedDesigns }
    if (!newDesigns[platform]) {
      newDesigns[platform] = {}
    }
    
    if (newDesigns[platform][design]) {
      delete newDesigns[platform][design]
      // If no designs left for platform, remove platform
      if (Object.keys(newDesigns[platform]).length === 0) {
        delete newDesigns[platform]
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
      }
    } else {
      newDesigns[platform][design] = true
    }
    
    setSelectedDesigns(newDesigns)
  }

  // Calculate total price
  const calculateTotal = () => {
    let total = 0
    
    // Calculate design prices
    Object.entries(selectedDesigns).forEach(([platform, designs]) => {
      const platformData = PLATFORMS.find(p => p.value === platform)
      if (platformData) {
        Object.keys(designs).forEach(designKey => {
          const design = platformData.designs.find(d => d.value === designKey)
          if (design) {
            // Carousel designs are package prices, not multiplied by count
            if (design.value === 'carousel' || design.value === 'carousel_ad') {
              total += design.price
            } else {
              total += design.price * designCount
            }
          }
        })
      }
    })
    
    // Add additional services (applied to total design count)
    additionalServices.forEach(serviceKey => {
      const service = ADDITIONAL_SERVICES.find(s => s.value === serviceKey)
      if (service) {
        if (service.value === 'template_files' || service.value === 'rush_delivery') {
          // These are one-time charges
          total += service.price
        } else {
          // These are per design charges
          total += service.price * designCount
        }
      }
    })
    
    // Add extra revisions (5 AZN per revision per design)
    if (extraRevisions > 0) {
      total += extraRevisions * 5 * designCount
    }
    
    return total
  }

  const totalPrice = calculateTotal()
  
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
  
  const selectedDesignCount = Object.values(selectedDesigns).reduce((acc, designs) => 
    acc + Object.keys(designs).length, 0
  )

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'
  const selectedPlatformNames = selectedPlatforms.map(p => 
    PLATFORMS.find(platform => platform.value === p)?.label
  ).join(', ')
  
  const msg = encodeURIComponent(
    `Salam! Sosial Media Dizayn sifarişi: ${selectedPlatformNames}, ${selectedDesignCount} növ dizayn, ${designCount} ədəd${extraRevisions > 0 ? `, ${extraRevisions} əlavə düzəliş` : ''}. ${appliedCoupon ? `Endirim kuponu: ${appliedCoupon.code} (-${appliedCoupon.discount} AZN). ` : ''}Cəmi məbləğ: ${finalPrice} AZN.`
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Left: Calculator ── */}
      <div className="lg:col-span-3 space-y-5">

        {/* General Rules */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">📌 {t('generalRules')}</h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('oneDesignOneContent')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('revisionOneFree')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('delivery24h')}
            </li>
          </ul>
        </div>

        {/* Platform Selection */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('platformSelection')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.value}
                onClick={() => handlePlatformToggle(platform.value)}
                className={cn(
                  'flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-xs font-medium transition-all border',
                  selectedPlatforms.includes(platform.value)
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25'
                )}
              >
                {renderPlatformIcon(platform.icon)}
                <span className="text-center">{platform.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Design Types for Selected Platforms */}
        {selectedPlatforms.map(platformKey => {
          const platform = PLATFORMS.find(p => p.value === platformKey)
          if (!platform) return null

          return (
            <div key={platformKey} className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
              <label className="flex items-center gap-2 text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
                {renderPlatformIcon(platform.icon)}
                <span>{platform.label} {t('designTypes')}</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {platform.designs.map((design) => (
                  <button
                    key={design.value}
                    onClick={() => handleDesignToggle(platformKey, design.value)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border text-left',
                      selectedDesigns[platformKey]?.[design.value]
                        ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                        : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                    )}
                  >
                    <div className="flex flex-col">
                      <span>
                        {t(`platforms.${platform.value}.${design.value}`)}
                      </span>
                      {design.note && (
                        <span className="text-xs opacity-60 mt-0.5">{t('packagePrice')}</span>
                      )}
                    </div>
                    <span className="text-xs opacity-70 ml-2">{design.price} AZN</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {/* Design Count */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('designCount')}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="100"
              value={designCount}
              onChange={(e) => setDesignCount(parseInt(e.target.value))}
              className="flex-1 h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={designCount}
                onChange={(e) => setDesignCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-1 text-sm bg-bg-tertiary border border-white/10 rounded-lg text-center"
              />
              <span className="text-xs text-text-muted">{t('pieces')}</span>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('additionalServices')}
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                const isSelected = additionalServices.includes('custom_icons')
                if (isSelected) {
                  setAdditionalServices(additionalServices.filter(s => s !== 'custom_icons'))
                } else {
                  setAdditionalServices([...additionalServices, 'custom_icons'])
                }
              }}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border text-left',
                additionalServices.includes('custom_icons')
                  ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('services.custom_icons')}</span>
              <span className="text-xs opacity-70 ml-2">+3 AZN {t('perDesign')}</span>
            </button>
            <button
              onClick={() => {
                const isSelected = additionalServices.includes('copywriting')
                if (isSelected) {
                  setAdditionalServices(additionalServices.filter(s => s !== 'copywriting'))
                } else {
                  setAdditionalServices([...additionalServices, 'copywriting'])
                }
              }}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border text-left',
                additionalServices.includes('copywriting')
                  ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('services.copywriting')}</span>
              <span className="text-xs opacity-70 ml-2">+10 AZN {t('perDesign')}</span>
            </button>
            <button
              onClick={() => {
                const isSelected = additionalServices.includes('template_files')
                if (isSelected) {
                  setAdditionalServices(additionalServices.filter(s => s !== 'template_files'))
                } else {
                  setAdditionalServices([...additionalServices, 'template_files'])
                }
              }}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border text-left',
                additionalServices.includes('template_files')
                  ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('services.template_files')}</span>
              <span className="text-xs opacity-70 ml-2">+20 AZN</span>
            </button>
            <button
              onClick={() => {
                const isSelected = additionalServices.includes('rush_delivery')
                if (isSelected) {
                  setAdditionalServices(additionalServices.filter(s => s !== 'rush_delivery'))
                } else {
                  setAdditionalServices([...additionalServices, 'rush_delivery'])
                }
              }}
              className={cn(
                'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border text-left',
                additionalServices.includes('rush_delivery')
                  ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                  : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
              )}
            >
              <span>{t('services.rush_delivery')}</span>
              <span className="text-xs opacity-70 ml-2">+10 AZN</span>
            </button>
          </div>
        </div>

        {/* Extra Revisions */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            {t('extraRevisions')}
            {extraRevisions > 0 && (
              <span className="text-accent-secondary normal-case ml-2">
                (+{extraRevisions * 5 * designCount} AZN)
              </span>
            )}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={extraRevisions}
              onChange={(e) => setExtraRevisions(parseInt(e.target.value))}
              className="flex-1 h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={extraRevisions}
                onChange={(e) => setExtraRevisions(Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 text-sm bg-bg-tertiary border border-white/10 rounded-lg text-center"
              />
              <span className="text-xs text-text-muted">{t('extraRevision')}</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">
            {t('perExtraRevision')}
          </p>
        </div>

        {/* Mobile price */}
        <div className="lg:hidden rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-5">
          <p className="text-text-muted text-xs mb-1">{t('totalAmount')}</p>
          {appliedCoupon && (
            <div className="mb-2">
              <p className="text-sm text-text-secondary line-through">{totalPrice} AZN</p>
              <p className="text-xs text-green-400">{t('discount')}: -{appliedCoupon.discount} AZN</p>
            </div>
          )}
          <p className="text-3xl font-display font-bold gradient-text mb-2">
            {finalPrice} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          <p className="text-text-muted text-xs mb-4">{t('taxIncluded')}</p>
          
          {/* Mobile Coupon Section */}
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
      <div className="lg:col-span-2 space-y-4">

        {/* Price panel */}
        <div
          className="hidden lg:block rounded-2xl p-5 sticky top-24"
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
          <p className="text-text-muted text-[10px] mb-4">{t('taxIncluded')}</p>

          
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
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #25D366, #20bd5a)', boxShadow: '0 0 16px rgba(37,211,102,0.3)' }}
            >
              <MessageCircle size={16} />
              {t('orderNow')}
            </a>
          </div>
        </div>


        {/* File requirements */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">📁 {t('fileRequirements')}</h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('fileRequirementsItems.visualMaterials')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('fileRequirementsItems.textMaterials')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('fileRequirementsItems.brandElements')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('fileRequirementsItems.logoIdentity')}
            </li>
            <li className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent-primary mt-0.5 shrink-0">•</span>
              {t('fileRequirementsItems.referenceMaterials')}
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">❓ {t('faq')}</h3>
          <div className="space-y-2">
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
              >
                {t('faqItems.q1')}
                {openFaq === 0 ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
              </button>
              {openFaq === 0 && (
                <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                  {t('faqItems.a1')}
                </div>
              )}
            </div>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
              >
                {t('faqItems.q2')}
                {openFaq === 1 ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
              </button>
              {openFaq === 1 && (
                <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                  {t('faqItems.a2')}
                </div>
              )}
            </div>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
              >
                {t('faqItems.q3')}
                {openFaq === 2 ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
              </button>
              {openFaq === 2 && (
                <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                  {t('faqItems.a3')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}