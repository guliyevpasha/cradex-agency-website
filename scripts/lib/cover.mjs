/**
 * Article cover art.
 *
 * Deliberately typeless: the title is already set in the card and on the
 * article page, and baking it into the image would mean four covers per
 * article (one per language) plus a font dependency that has to survive
 * rasterisation on any machine. What the cover carries instead is identity —
 * one visual family across the whole journal, one accent colour per category,
 * and a composition seeded from the slug so no two covers repeat.
 *
 * The motif is the hero's 360° orbit: concentric rings, an arc sweep, a few
 * nodes riding the circle. That is what makes a reader who lands on an article
 * from Google recognise it as the same brand as the site.
 */

const PALETTES = {
  seo: ['#6C63FF', '#00D4FF'],
  smm: ['#FF6BAA', '#7C5CFF'],
  branding: ['#FFA45B', '#FF6B6B'],
  design: ['#22C55E', '#00D4FF'],
  copywriting: ['#A78BFA', '#F0ABFC'],
  'web-dev': ['#3B82F6', '#00D4FF'],
  'marketing-strategy': ['#FF6B6B', '#FFB347'],
}

/** Deterministic PRNG so a slug always produces the same cover. */
function seeded(slug) {
  let h = 2166136261
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 100000) / 100000
  }
}

const W = 1600
const H = 900

export function coverSvg(slug, category) {
  const [c1, c2] = PALETTES[category] ?? PALETTES.seo
  const rnd = seeded(slug)

  // Composition variables — every cover sits in the same family but none of
  // them lands in the same place.
  const cx = 1090 + Math.round(rnd() * 240 - 120)
  const cy = 450 + Math.round(rnd() * 160 - 80)
  const baseR = 190 + Math.round(rnd() * 70)
  const tilt = Math.round(rnd() * 60 - 30)
  const sweepStart = Math.round(rnd() * 360)
  const sweepLen = 90 + Math.round(rnd() * 110)
  const glowX = 60 + Math.round(rnd() * 25)
  const glowY = 35 + Math.round(rnd() * 30)

  // Nodes riding the outer ring.
  const nodeCount = 3 + Math.floor(rnd() * 3)
  const nodes = Array.from({ length: nodeCount }, () => {
    const a = rnd() * Math.PI * 2
    const r = baseR + 60 + rnd() * 120
    return {
      x: (cx + Math.cos(a) * r).toFixed(1),
      y: (cy + Math.sin(a) * r * 0.82).toFixed(1),
      r: (3 + rnd() * 4).toFixed(1),
      o: (0.35 + rnd() * 0.5).toFixed(2),
    }
  })

  // Arc sweep drawn as a stroked circle with a dash pattern, which keeps the
  // geometry exact without hand-rolling arc path maths.
  const circumference = 2 * Math.PI * (baseR + 120)
  const dash = (circumference * (sweepLen / 360)).toFixed(1)
  const gap = (circumference - Number(dash)).toFixed(1)

  // Grid drawn as explicit lines rather than a <pattern> behind a <mask>:
  // the pattern/mask combination rasterised with a visible smudge across the
  // middle of the frame, and per-line opacity gives a cleaner falloff anyway.
  const gridLines = []
  for (let x = 64; x < W; x += 64) {
    const d = Math.abs(x - W * 0.5) / (W * 0.5)
    const o = (0.05 * (1 - d * 0.9)).toFixed(3)
    if (Number(o) > 0.004) gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="${o}" stroke-width="1"/>`)
  }
  for (let y = 64; y < H; y += 64) {
    const d = Math.abs(y - H * 0.45) / (H * 0.55)
    const o = (0.05 * (1 - d * 0.9)).toFixed(3)
    if (Number(o) > 0.004) gridLines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="${o}" stroke-width="1"/>`)
  }

  // A loose scatter of points on the empty side, so the frame does not read as
  // "artwork on the right, nothing on the left".
  const dust = Array.from({ length: 22 }, () => {
    const x = (60 + rnd() * 620).toFixed(0)
    const y = (60 + rnd() * 780).toFixed(0)
    const r = (1 + rnd() * 2.2).toFixed(1)
    const o = (0.08 + rnd() * 0.26).toFixed(2)
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" fill-opacity="${o}"/>`
  }).join('')

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 * Math.PI) / 180
    const inner = baseR + 150
    const outer = inner + (i % 5 === 0 ? 18 : 9)
    return `<line x1="${(cx + Math.cos(a) * inner).toFixed(1)}" y1="${(cy + Math.sin(a) * inner * 0.82).toFixed(1)}" x2="${(cx + Math.cos(a) * outer).toFixed(1)}" y2="${(cy + Math.sin(a) * outer * 0.82).toFixed(1)}" stroke="#ffffff" stroke-opacity="${i % 5 === 0 ? 0.22 : 0.09}" stroke-width="${i % 5 === 0 ? 2 : 1.2}" stroke-linecap="round"/>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0A18"/>
      <stop offset="55%" stop-color="#080713"/>
      <stop offset="100%" stop-color="#05040C"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glowX}%" cy="${glowY}%" r="62%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.38"/>
      <stop offset="42%" stop-color="${c1}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="14%" cy="86%" r="55%">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.26"/>
      <stop offset="45%" stop-color="${c2}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.85"/>
      <stop offset="50%" stop-color="${c2}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#base)"/>
  ${gridLines.join('\n  ')}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#streak)" transform="rotate(-18 ${W / 2} ${H / 2})"/>

  <g transform="rotate(${tilt} ${cx} ${cy})">
    ${ticks}
  </g>

  <ellipse cx="${cx}" cy="${cy}" rx="${baseR + 120}" ry="${(baseR + 120) * 0.82}" fill="none" stroke="url(#ring)" stroke-width="2"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${baseR + 40}" ry="${(baseR + 40) * 0.82}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1.5"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${baseR}" ry="${baseR * 0.82}" fill="none" stroke="${c1}" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="3 10"/>

  <ellipse cx="${cx}" cy="${cy}" rx="${baseR + 120}" ry="${(baseR + 120) * 0.82}" fill="none" stroke="url(#sweep)" stroke-width="4" stroke-linecap="round"
    stroke-dasharray="${dash} ${gap}" transform="rotate(${sweepStart} ${cx} ${cy})"/>

  <circle cx="${cx}" cy="${cy}" r="${baseR * 0.62}" fill="${c1}" fill-opacity="0.07"/>
  <circle cx="${cx}" cy="${cy}" r="${baseR * 0.62}" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>

  ${nodes
    .map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${c2}" fill-opacity="${n.o}"/>`)
    .join('\n  ')}

  ${dust}

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`
}
