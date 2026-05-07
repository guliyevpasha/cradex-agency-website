'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Pricing data ──────────────────────────────────────────────────────────────
const SERVICE_TYPES = [
  { value: 'feed', label: 'Feed post dizaynı', baseMin: 15, baseMax: 30 },
  { value: 'stories', label: 'Stories / Reels kapak', baseMin: 10, baseMax: 20 },
  { value: 'carousel', label: 'Carousel (çoxşəkilli post)', baseMin: 25, baseMax: 50 },
  { value: 'banner', label: 'Reklam banneri', baseMin: 30, baseMax: 60 },
]

const COUNTS = [
  { value: 4, label: '4 post' },
  { value: 8, label: '8 post' },
  { value: 12, label: '12 post' },
  { value: 20, label: '20 post' },
  { value: 30, label: '30 post' },
]

const PLATFORMS: { value: string; label: string; icon: string; formats: { value: string; label: string; size: string }[] }[] = [
  {
    value: 'instagram',
    label: 'Instagram',
    icon: '📸',
    formats: [
      { value: '1:1', label: 'Kvadrat', size: '1080×1080 px' },
      { value: '4:5', label: 'Portret', size: '1080×1350 px' },
      { value: '9:16', label: 'Stories/Reels', size: '1080×1920 px' },
      { value: '1.91:1', label: 'Landscape', size: '1080×566 px' },
    ],
  },
  {
    value: 'facebook',
    label: 'Facebook',
    icon: '👥',
    formats: [
      { value: '1:1', label: 'Kvadrat', size: '1080×1080 px' },
      { value: '1.91:1', label: 'Landscape', size: '1200×628 px' },
      { value: '9:16', label: 'Stories', size: '1080×1920 px' },
    ],
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: '💼',
    formats: [
      { value: '1.91:1', label: 'Landscape', size: '1200×627 px' },
      { value: '1:1', label: 'Kvadrat', size: '1080×1080 px' },
      { value: '4:5', label: 'Portret', size: '1080×1350 px' },
    ],
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    icon: '🎵',
    formats: [
      { value: '9:16', label: 'Şaquli', size: '1080×1920 px' },
      { value: '1:1', label: 'Kvadrat', size: '1080×1080 px' },
    ],
  },
]

const EXTRAS = [
  { value: 'icons', label: 'Xüsusi ikonlar / İllüstrasiyalar', addMin: 5, addMax: 15 },
  { value: 'animation', label: 'Animasiyalı post (GIF/MP4)', addMin: 20, addMax: 40 },
  { value: 'copywriting', label: 'Mətn yazılması (caption)', addMin: 5, addMax: 10 },
  { value: 'hashtag', label: 'Hashtag tədqiqatı', addMin: 10, addMax: 20 },
  { value: 'template', label: 'Yenidən istifadə edilə bilən şablon', addMin: 30, addMax: 60 },
  { value: 'brandbook', label: 'Brend rənglərinə uyğunlaşdırma', addMin: 15, addMax: 30 },
]

const URGENT = { addMin: 30, addMax: 60, label: 'Təcili hazırlanma (8 saat)' }

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Post dizaynları neçə gündə hazır olur?',
    a: 'Standart sifarişlər 1–3 iş günü ərzində tamamlanır. Aylıq paketlər üçün məzmun təqvimi əvvəlcədən razılaşdırılır.',
  },
  {
    q: 'Hansı formatda fayl təhvil verilir?',
    a: 'PNG, JPG və PDF formatlarında təhvil verilir. Tələb olunarsa Canva, Figma və ya PSD faylları da göndərilə bilər.',
  },
  {
    q: 'Brend rənglərimi istifadə edə bilərsinizmi?',
    a: 'Bəli, brend rənglərinizi, şriftlərinizi və loqonuzu istifadə edərək dizayn hazırlayırıq. Brend book varsa, paylaşın.',
  },
]

// ── File requirements ─────────────────────────────────────────────────────────
const FILE_REQS = [
  'Logo: SVG və ya PNG (şəffaf arxa fon, min 500×500 px)',
  'Brend rəngləri: HEX kodları',
  'Şriftlər: TTF, OTF formatında (varsa)',
  'Şəkillər: JPG, PNG (minimum 1080×1080 px)',
  'Məzmun: Word, Google Docs və ya mesaj şəklində',
  'Nümunə dizaynlar: İstiqamət üçün bənzər nümunələr',
]

// ── Component ─────────────────────────────────────────────────────────────────
export function SmmPostCalculator() {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0].value)
  const [count, setCount] = useState(8)
  const [platform, setPlatform] = useState(PLATFORMS[0].value)
  const [postFormat, setPostFormat] = useState(PLATFORMS[0].formats[0].value)
  const [extras, setExtras] = useState<string[]>([])
  const [urgent, setUrgent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const activePlatform = PLATFORMS.find((p) => p.value === platform)!
  const svc = SERVICE_TYPES.find((s) => s.value === serviceType)!

  // Calculate
  let baseMin = svc.baseMin * count
  let baseMax = svc.baseMax * count

  for (const ex of extras) {
    const e = EXTRAS.find((x) => x.value === ex)!
    baseMin += e.addMin * count
    baseMax += e.addMax * count
  }

  if (urgent) {
    baseMin += URGENT.addMin
    baseMax += URGENT.addMax
  }

  const totalMin = Math.round(baseMin)
  const totalMax = Math.round(baseMax)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '994507786887'
  const msg = encodeURIComponent(
    `Salam! Sosial media post sifarişi: ${svc.label}, ${count} post, ${activePlatform.label}. Təxmini qiymət: ${totalMin}–${totalMax} AZN.`
  )

  // Update format when platform changes
  function handlePlatformChange(val: string) {
    setPlatform(val)
    const p = PLATFORMS.find((x) => x.value === val)!
    setPostFormat(p.formats[0].value)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Left: Calculator ── */}
      <div className="lg:col-span-3 space-y-5">

        {/* Service type */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Xidmət</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SERVICE_TYPES.map((s) => (
              <button
                key={s.value}
                onClick={() => setServiceType(s.value)}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border',
                  serviceType === s.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                )}
              >
                {s.label}
                <span className="block text-xs mt-0.5 opacity-60">{s.baseMin}–{s.baseMax} AZN/post</span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Say (aylıq)</label>
          <div className="flex flex-wrap gap-2">
            {COUNTS.map((c) => (
              <button
                key={c.value}
                onClick={() => setCount(c.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  count === c.value
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Sosial media hesabı</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePlatformChange(p.value)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all border',
                  platform === p.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25'
                )}
              >
                <span className="text-xl">{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* Post format for selected platform */}
          <div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
              Kontent post ölçüsü ({activePlatform.label})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activePlatform.formats.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setPostFormat(f.value)}
                  className={cn(
                    'px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-center',
                    postFormat === f.value
                      ? 'bg-accent-secondary/15 border-accent-secondary/60 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25'
                  )}
                >
                  <span className="block font-bold">{f.label}</span>
                  <span className="block opacity-60 mt-0.5">{f.value}</span>
                  <span className="block opacity-40 text-[9px] mt-0.5">{f.size}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Extras */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            Əlavə xidmətlər <span className="text-accent-secondary normal-case">(ekstra ödənişli)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXTRAS.map((e) => {
              const active = extras.includes(e.value)
              return (
                <button
                  key={e.value}
                  onClick={() =>
                    setExtras(active ? extras.filter((x) => x !== e.value) : [...extras, e.value])
                  }
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border',
                    active
                      ? 'bg-accent-secondary/10 border-accent-secondary/50 text-accent-secondary'
                      : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
                  )}
                >
                  <span>{e.label}</span>
                  <span className="text-xs opacity-70 ml-2">+{e.addMin}–{e.addMax} AZN</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Urgent */}
        <button
          onClick={() => setUrgent(!urgent)}
          className={cn(
            'w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-sm font-medium transition-all',
            urgent
              ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
              : 'border-white/10 text-text-secondary hover:border-white/25 hover:text-text-primary'
          )}
        >
          <span>⚡ {URGENT.label}</span>
          <span className="text-xs opacity-70">+{URGENT.addMin}–{URGENT.addMax} AZN</span>
        </button>

        {/* Mobile price */}
        <div className="lg:hidden rounded-2xl border border-accent-primary/30 bg-accent-primary/5 p-5">
          <p className="text-text-muted text-xs mb-1">Təxmini məbləğ</p>
          <p className="text-3xl font-display font-bold gradient-text mb-4">
            {totalMin} – {totalMax} <span className="text-lg text-text-secondary font-normal">AZN</span>
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm"
          >
            <MessageCircle size={16} />
            Sifariş formuna keç
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
          <p className="text-text-muted text-xs mb-1">Təxmini məbləğ</p>
          <p className="font-display font-bold gradient-text mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)' }}>
            {totalMin} – {totalMax}
            <span className="text-base text-text-secondary font-normal ml-1">AZN</span>
          </p>
          <p className="text-text-muted text-[10px] mb-4">* Dəqiq qiymət müzakirə zamanı müəyyənləşir</p>
          <div className="space-y-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #25D366, #20bd5a)', boxShadow: '0 0 16px rgba(37,211,102,0.3)' }}
            >
              <MessageCircle size={16} />
              Sifariş formuna keç
            </a>
            <a
              href="contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm text-text-secondary border border-white/10 hover:border-white/25 transition-all"
            >
              Əlaqə formu
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* File requirements */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">📁 Fayl tələbləri</h3>
          <ul className="space-y-1.5">
            {FILE_REQS.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                <span className="text-accent-primary mt-0.5 shrink-0">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-3">❓ Tez-tez verilən suallar</h3>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-medium text-text-primary hover:bg-white/[0.03] transition-colors"
                >
                  {item.q}
                  {openFaq === i ? <ChevronUp size={14} className="shrink-0 text-accent-primary" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs text-text-secondary border-t border-white/10 pt-2">
                    {item.a}
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
