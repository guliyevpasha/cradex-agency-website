'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// ── Pricing data ──────────────────────────────────────────────────────────────
const SERVICE_TYPES = [
  { value: 'social', label: 'Sosial media videosu', baseMin: 80, baseMax: 150 },
  { value: 'reels', label: 'Reels / Short video', baseMin: 60, baseMax: 120 },
  { value: 'ad', label: 'Reklam videosu', baseMin: 150, baseMax: 300 },
  { value: 'corporate', label: 'Korporativ / Tanıtım videosu', baseMin: 250, baseMax: 500 },
]

const COUNTS = [
  { value: 1, label: '1 video' },
  { value: 2, label: '2 video' },
  { value: 3, label: '3 video' },
  { value: 5, label: '5 video' },
  { value: 10, label: '10 video' },
]

const DURATIONS = [
  { value: '15s', label: '15 saniyə', mult: 1.0 },
  { value: '30s', label: '30 saniyə', mult: 1.3 },
  { value: '60s', label: '60 saniyə', mult: 1.7 },
  { value: '2-3m', label: '2–3 dəqiqə', mult: 2.5 },
  { value: '5m+', label: '5+ dəqiqə', mult: 4.0 },
]

const QUALITY = [
  { value: '1080p', label: '1080p Full HD', desc: 'Standart keyfiyyət', mult: 1.0 },
  { value: '4k', label: '4K Ultra HD', desc: 'Yüksək keyfiyyət', mult: 1.4 },
]

const FORMATS = [
  { value: '16:9', label: '16:9', desc: 'YouTube / TV', icon: '🖥️' },
  { value: '9:16', label: '9:16', desc: 'Reels / Stories', icon: '📱' },
  { value: '1:1', label: '1:1', desc: 'Instagram post', icon: '⬛' },
  { value: '4:5', label: '4:5', desc: 'Instagram feed', icon: '📷' },
]

const AUDIO = [
  { value: 'none', label: 'Səssiz', addMin: 0, addMax: 0 },
  { value: 'music', label: 'Musiqi əlavəsi', addMin: 15, addMax: 30 },
  { value: 'voiceover', label: 'Voiceover (diktor)', addMin: 40, addMax: 80 },
  { value: 'both', label: 'Musiqi + Voiceover', addMin: 55, addMax: 100 },
]

const EXTRAS = [
  { value: 'animation', label: 'Animasiya / Motion grafika', addMin: 50, addMax: 120 },
  { value: 'subtitles', label: 'Altyazı əlavəsi', addMin: 15, addMax: 30 },
  { value: 'color', label: 'Rəng korreksiyası (Color grade)', addMin: 20, addMax: 50 },
  { value: 'thumbnail', label: 'Thumbnail / Kapak dizaynı', addMin: 20, addMax: 40 },
  { value: 'script', label: 'Ssenari yazılması', addMin: 30, addMax: 70 },
]

const URGENT = { addMin: 50, addMax: 100, label: 'Təcili hazırlanma (8 saat)' }

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'Video neçə gündə hazır olur?',
    a: 'Standart sifarişlər 2–5 iş günü ərzində tamamlanır. Təcili sifariş seçsəniz, 8 saat ərzində hazır olur.',
  },
  {
    q: 'Hansı formatda fayl təhvil verilir?',
    a: 'MP4 (H.264) formatında təhvil verilir. Tələb olunarsa MOV, AVI və ya digər formatlar da mümkündür.',
  },
  {
    q: 'Düzəliş hüququ varmı?',
    a: 'Bəli, hər sifarişə 2 pulsuz düzəliş daxildir. Əlavə düzəlişlər razılaşdırılmış qiymətlə həyata keçirilir.',
  },
]

// ── File requirements ─────────────────────────────────────────────────────────
const FILE_REQS = [
  'Video materiallar: MP4, MOV, AVI formatında',
  'Şəkillər: JPG, PNG (minimum 1920×1080 px)',
  'Logo: SVG və ya PNG (şəffaf arxa fon)',
  'Musiqi: MP3, WAV formatında (lisenziyalı)',
  'Mətn: Word sənədi və ya Google Docs',
  'Rəng kodu: HEX və ya RGB formatında',
]

// ── Component ─────────────────────────────────────────────────────────────────
export function VideoCalculator() {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0].value)
  const [count, setCount] = useState(1)
  const [duration, setDuration] = useState(DURATIONS[0].value)
  const [quality, setQuality] = useState(QUALITY[0].value)
  const [format, setFormat] = useState(FORMATS[0].value)
  const [audio, setAudio] = useState(AUDIO[0].value)
  const [extras, setExtras] = useState<string[]>([])
  const [urgent, setUrgent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Calculate price
  const svc = SERVICE_TYPES.find((s) => s.value === serviceType)!
  const dur = DURATIONS.find((d) => d.value === duration)!
  const qual = QUALITY.find((q) => q.value === quality)!
  const aud = AUDIO.find((a) => a.value === audio)!

  let baseMin = svc.baseMin * dur.mult * qual.mult * count
  let baseMax = svc.baseMax * dur.mult * qual.mult * count

  baseMin += aud.addMin * count
  baseMax += aud.addMax * count

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
    `Salam! Video montaj sifarişi: ${svc.label}, ${count} video, ${dur.label}, ${qual.label}. Təxmini qiymət: ${totalMin}–${totalMax} AZN.`
  )

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
                <span className="block text-xs mt-0.5 opacity-60">{s.baseMin}–{s.baseMax} AZN/video</span>
              </button>
            ))}
          </div>
        </div>

        {/* Count + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Say</label>
            <div className="flex flex-wrap gap-2">
              {COUNTS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCount(c.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
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

          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Video müddəti</label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    duration === d.value
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quality + Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Keyfiyyət</label>
            <div className="flex gap-2">
              {QUALITY.map((q) => (
                <button
                  key={q.value}
                  onClick={() => setQuality(q.value)}
                  className={cn(
                    'flex-1 px-3 py-3 rounded-xl text-sm font-medium transition-all border text-center',
                    quality === q.value
                      ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                      : 'border-white/10 text-text-secondary hover:border-white/25'
                  )}
                >
                  <span className="block font-bold">{q.label}</span>
                  <span className="block text-xs opacity-60 mt-0.5">{q.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
            <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Format / Ölçü</label>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={cn(
                    'px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-center',
                    format === f.value
                      ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                      : 'border-white/10 text-text-secondary hover:border-white/25'
                  )}
                >
                  <span className="block text-base">{f.icon}</span>
                  <span className="block font-bold">{f.value}</span>
                  <span className="block opacity-60 mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio */}
        <div className="rounded-2xl border border-white/10 bg-bg-secondary/50 p-5">
          <label className="block text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">Səs</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AUDIO.map((a) => (
              <button
                key={a.value}
                onClick={() => setAudio(a.value)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-center',
                  audio === a.value
                    ? 'bg-accent-primary/15 border-accent-primary/60 text-accent-primary'
                    : 'border-white/10 text-text-secondary hover:border-white/25'
                )}
              >
                {a.label}
                {a.addMin > 0 && <span className="block text-[10px] mt-0.5 opacity-60">+{a.addMin} AZN</span>}
              </button>
            ))}
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

        {/* Price + CTA (mobile) */}
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

        {/* Price panel (desktop) */}
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
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
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
