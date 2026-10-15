'use client'

import { useEffect, useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OverviewData {
  sessions: string
  activeUsers: string
  pageViews: string
  avgSessionDuration: string
  bounceRate: string
  newUsers: string
  realtimeUsers: string
}

interface Row {
  dimensions: string[]
  metrics: string[]
}

interface AnalyticsData {
  overview: OverviewData
  pages: Row[]
  sources: Row[]
  devices: Row[]
  os: Row[]
  countries: Row[]
  cities: Row[]
  languages: Row[]
  keywords: Row[]
  age: Row[]
  dateRange: { startDate: string; endDate: string }
}

// ─── Date Range Presets ───────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Bu gün', startDate: 'today', endDate: 'today' },
  { label: 'Dünən', startDate: 'yesterday', endDate: 'yesterday' },
  { label: '7 gün', startDate: '7daysAgo', endDate: 'today' },
  { label: '30 gün', startDate: '30daysAgo', endDate: 'today' },
  { label: '3 ay', startDate: '90daysAgo', endDate: 'today' },
  { label: '6 ay', startDate: '180daysAgo', endDate: 'today' },
  { label: '9 ay', startDate: '270daysAgo', endDate: 'today' },
  { label: '1 il', startDate: '365daysAgo', endDate: 'today' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(val: string) {
  return Number(val).toLocaleString()
}

function fmtDuration(seconds: string) {
  const s = Math.round(Number(seconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}d ${rem}s`
}

function fmtPct(val: string) {
  return (Number(val) * 100).toFixed(1) + '%'
}

function sourceIcon(source: string) {
  const s = source.toLowerCase()
  if (s.includes('google')) return '🔍'
  if (s.includes('instagram')) return '📸'
  if (s.includes('facebook')) return '📘'
  if (s.includes('linkedin')) return '💼'
  if (s.includes('tiktok')) return '🎵'
  if (s.includes('whatsapp')) return '💬'
  if (s.includes('pinterest')) return '📌'
  if (s.includes('maps')) return '🗺️'
  if (s.includes('twitter') || s.includes('x.com')) return '🐦'
  if (s.includes('youtube')) return '▶️'
  if (s === '(direct)' || s === 'direct') return '🔗'
  return '🌐'
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid #2a2a4a',
      borderRadius: 12,
      padding: '16px 20px',
      minWidth: 140,
      flex: '1 1 140px',
    }}>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── Bar Row ──────────────────────────────────────────────────────────────────

function BarRow({ label, value, max, icon }: { label: string; value: number; max: number; icon?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', marginBottom: 3 }}>
        <span>{icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}</span>
        <span style={{ color: '#fff', fontWeight: 600 }}>{fmtNum(String(value))}</span>
      </div>
      <div style={{ height: 6, background: '#2a2a4a', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#667eea,#764ba2)', borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{title}</h3>
      {children}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preset, setPreset] = useState(PRESETS[3]) // Default: 30 days
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const startDate = useCustom ? customStart : preset.startDate
      const endDate = useCustom ? customEnd : preset.endDate
      const res = await fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Xəta baş verdi')
      }
      const json = await res.json()
      setData(json)
      setLastUpdated(new Date())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [preset, useCustom, customStart, customEnd])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const maxPages = data?.pages?.[0] ? Number(data.pages[0].metrics[0]) : 1
  const maxSources = data?.sources?.[0] ? Number(data.sources[0].metrics[0]) : 1
  const maxCountries = data?.countries?.[0] ? Number(data.countries[0].metrics[0]) : 1
  const maxCities = data?.cities?.[0] ? Number(data.cities[0].metrics[0]) : 1

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#0f0f1a', minHeight: '100vh', padding: 24, color: '#fff' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#fff' }}>📊 Analytics Dashboard</h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>cradexagency.com · {lastUpdated ? `Son yenilənmə: ${lastUpdated.toLocaleTimeString()}` : 'Yüklənir...'}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{ background: '#667eea', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? '⟳ Yüklənir...' : '↻ Yenilə'}
        </button>
      </div>

      {/* Date Range Selector */}
      <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setPreset(p); setUseCustom(false) }}
              style={{
                background: !useCustom && preset.label === p.label ? '#667eea' : '#2a2a4a',
                color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px',
                cursor: 'pointer', fontSize: 12, fontWeight: !useCustom && preset.label === p.label ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            style={{
              background: useCustom ? '#667eea' : '#2a2a4a',
              color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12,
            }}
          >
            Özəl
          </button>
        </div>
        {useCustom && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Başlanğıc</label>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)}
                style={{ background: '#2a2a4a', color: '#fff', border: '1px solid #3a3a5a', borderRadius: 6, padding: '6px 10px', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Son</label>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)}
                style={{ background: '#2a2a4a', color: '#fff', border: '1px solid #3a3a5a', borderRadius: 6, padding: '6px 10px', fontSize: 13 }} />
            </div>
            <button onClick={fetchData}
              style={{ background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', fontSize: 13, marginTop: 16 }}>
              Axtar
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#2d1515', border: '1px solid #7f2020', borderRadius: 8, padding: 16, marginBottom: 24, color: '#ff8080' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div style={{ color: '#888', textAlign: 'center', padding: 60, fontSize: 16 }}>📊 Məlumatlar yüklənir...</div>
      )}

      {data && (
        <>
          {/* Realtime Banner */}
          <div style={{ background: 'linear-gradient(135deg,#1a3a2a,#1a2a3a)', border: '1px solid #2a5a3a', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 14, color: '#4ade80', fontWeight: 600 }}>Canlı: {data.overview.realtimeUsers} aktiv istifadəçi</span>
            <span style={{ fontSize: 12, color: '#888', marginLeft: 'auto' }}>Real-time · hər 60s yenilənir</span>
          </div>

          {/* Overview Stats */}
          <Section title="Ümumi Statistika">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <StatCard label="Sessiyalar" value={fmtNum(data.overview.sessions)} />
              <StatCard label="Unikal İstifadəçi" value={fmtNum(data.overview.activeUsers)} />
              <StatCard label="Səhifə Baxışı" value={fmtNum(data.overview.pageViews)} />
              <StatCard label="Yeni İstifadəçi" value={fmtNum(data.overview.newUsers)} />
              <StatCard label="Ort. Sessiya Müddəti" value={fmtDuration(data.overview.avgSessionDuration)} />
              <StatCard label="Bounce Rate" value={fmtPct(data.overview.bounceRate)} />
            </div>
          </Section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

            {/* Top Pages */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Ən Çox Ziyarət Edilən Səhifələr">
                {data.pages.slice(0, 10).map((row, i) => (
                  <BarRow key={i} label={row.dimensions[0] || '/'} value={Number(row.metrics[0])} max={maxPages} />
                ))}
              </Section>
            </div>

            {/* Traffic Sources */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Trafik Mənbələri">
                {data.sources.slice(0, 12).map((row, i) => (
                  <BarRow key={i}
                    label={`${row.dimensions[0]} — ${row.dimensions[1]}`}
                    value={Number(row.metrics[0])}
                    max={maxSources}
                    icon={sourceIcon(row.dimensions[1])}
                  />
                ))}
              </Section>
            </div>

            {/* Devices */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Cihaz Növü">
                {data.devices.map((row, i) => {
                  const icons: Record<string, string> = { desktop: '🖥️', mobile: '📱', tablet: '📟' }
                  const maxD = Number(data.devices[0]?.metrics[0] ?? 1)
                  return <BarRow key={i} label={row.dimensions[0]} value={Number(row.metrics[0])} max={maxD} icon={icons[row.dimensions[0]] ?? '📱'} />
                })}
              </Section>

              <Section title="Əməliyyat Sistemi">
                {data.os.map((row, i) => {
                  const icons: Record<string, string> = { Android: '🤖', iOS: '🍎', Windows: '🪟', Macintosh: '🍎', Linux: '🐧' }
                  const maxO = Number(data.os[0]?.metrics[0] ?? 1)
                  return <BarRow key={i} label={row.dimensions[0]} value={Number(row.metrics[0])} max={maxO} icon={icons[row.dimensions[0]] ?? '💻'} />
                })}
              </Section>
            </div>

            {/* Countries */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Ölkələr">
                {data.countries.slice(0, 10).map((row, i) => (
                  <BarRow key={i} label={row.dimensions[0]} value={Number(row.metrics[0])} max={maxCountries} icon="🌍" />
                ))}
              </Section>
            </div>

            {/* Cities */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Şəhərlər">
                {data.cities.slice(0, 10).map((row, i) => (
                  <BarRow key={i} label={`${row.dimensions[0]}, ${row.dimensions[1]}`} value={Number(row.metrics[0])} max={maxCities} icon="🏙️" />
                ))}
              </Section>
            </div>

            {/* Languages */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Dil Üzrə Ziyarətçilər">
                {data.languages.slice(0, 10).map((row, i) => {
                  const langMap: Record<string, string> = { az: '🇦🇿 Azərbaycan', ru: '🇷🇺 Rus', en: '🇬🇧 İngilis', tr: '🇹🇷 Türk' }
                  const lang = row.dimensions[0].slice(0, 2).toLowerCase()
                  const maxL = Number(data.languages[0]?.metrics[0] ?? 1)
                  return <BarRow key={i} label={langMap[lang] ?? row.dimensions[0]} value={Number(row.metrics[0])} max={maxL} />
                })}
              </Section>
            </div>

            {/* Age */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Yaş Aralığı">
                {data.age.length > 0 ? (
                  data.age.map((row, i) => {
                    const maxA = Number(data.age[0]?.metrics[0] ?? 1)
                    return <BarRow key={i} label={row.dimensions[0]} value={Number(row.metrics[0])} max={maxA} icon="👤" />
                  })
                ) : (
                  <p style={{ color: '#888', fontSize: 12 }}>Yaş məlumatı üçün Google Signals aktivləşdirilməlidir.</p>
                )}
              </Section>
            </div>

            {/* Keywords */}
            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 12, padding: 20 }}>
              <Section title="Açar Sözlər">
                {data.keywords.filter(r => r.dimensions[0] && r.dimensions[0] !== '(not set)').length > 0 ? (
                  data.keywords
                    .filter(r => r.dimensions[0] && r.dimensions[0] !== '(not set)')
                    .slice(0, 10)
                    .map((row, i) => {
                      const maxK = Number(data.keywords[0]?.metrics[0] ?? 1)
                      return <BarRow key={i} label={row.dimensions[0]} value={Number(row.metrics[0])} max={maxK} icon="🔑" />
                    })
                ) : (
                  <p style={{ color: '#888', fontSize: 12 }}>
                    Açar söz məlumatı Google Search Console-dan alınır. Məlumat yığılmağa davam edir.
                  </p>
                )}
              </Section>
            </div>

          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
