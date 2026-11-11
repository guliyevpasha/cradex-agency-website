/**
 * Turns collected client logos into what the partners wall expects: solid
 * white artwork on a transparent background, trimmed, large enough for any
 * screen. Vector sources are rendered at high density first, so nothing is
 * scaled up from a small bitmap.
 *
 *   node scripts/whiten-logos.mjs <logosDir> <outDir> [overrides.json]
 *
 * A logo with real transparency keeps its own outline; one on a flat
 * background (JPEG, opaque PNG) is cut out by its distance from that colour.
 * Writes <key>.png and report.json (source size, how it was cut, warnings).
 *
 * overrides.json, per key, for the logos a plain outline ruins:
 *   "tone": "dark" | "light"  keep only the dark (or light) parts, so a mark
 *                             with a filled plate keeps its drawing
 *   "label": "Name"           the site shows the name as text next to an
 *                             icon; set it beside the icon the same way
 * @author Paşa Quliyev — Cradex Agency
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const [, , inDir, outDir, overridesFile] = process.argv
if (!inDir || !outDir) {
  console.error('usage: node scripts/whiten-logos.mjs <logosDir> <outDir>')
  process.exit(1)
}
await mkdir(outDir, { recursive: true })

const overrides = overridesFile ? JSON.parse(await readFile(overridesFile, 'utf8')) : {}

const MAX_H = 240
const MAX_W = 760

async function whiten(file) {
  const key = path.basename(file).replace(/\.[^.]+$/, '')
  const svg = file.endsWith('.svg')
  const src = sharp(await readFile(path.join(inDir, file)), svg ? { density: 600 } : {})
  const meta = await src.metadata()
  const { data, info } = await src.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const px = width * height

  // share of pixels that are see-through: tells a cut-out logo from a flat one
  let clear = 0
  for (let i = 0; i < px; i++) if (data[i * 4 + 3] < 16) clear++
  const cutOut = clear / px > 0.04

  const mask = Buffer.alloc(px)
  let how
  if (cutOut) {
    how = 'own transparency'
    for (let i = 0; i < px; i++) mask[i] = data[i * 4 + 3]
  } else {
    // background = the colour of the four corners
    how = 'cut from flat background'
    const at = (x, y) => [0, 1, 2].map((c) => data[(y * width + x) * 4 + c])
    const corners = [at(1, 1), at(width - 2, 1), at(1, height - 2), at(width - 2, height - 2)]
    const bg = [0, 1, 2].map((c) => corners.reduce((s, k) => s + k[c], 0) / 4)
    for (let i = 0; i < px; i++) {
      const d = Math.hypot(data[i * 4] - bg[0], data[i * 4 + 1] - bg[1], data[i * 4 + 2] - bg[2])
      // soft edge between "background" (under 24) and "ink" (over 96)
      mask[i] = Math.max(0, Math.min(255, Math.round(((d - 24) / 72) * 255)))
    }
  }

  const o = overrides[key] ?? {}
  if (o.tone) {
    // spread between the darkest and lightest visible colour, then keep one end
    how += `, ${o.tone} parts only`
    const luma = (i) => (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255
    let lo = 1
    let hi = 0
    for (let i = 0; i < px; i++) {
      if (mask[i] < 128) continue
      const l = luma(i)
      if (l < lo) lo = l
      if (l > hi) hi = l
    }
    const mid = (lo + hi) / 2
    const band = Math.max((hi - lo) * 0.18, 0.02)
    for (let i = 0; i < px; i++) {
      const t = Math.max(0, Math.min(1, (luma(i) - (mid - band)) / (2 * band)))
      mask[i] = Math.round(mask[i] * (o.tone === 'light' ? t : 1 - t))
    }
  }

  const white = Buffer.alloc(px * 4, 255)
  for (let i = 0; i < px; i++) white[i * 4 + 3] = mask[i]

  const trimmed = await sharp(white, { raw: { width, height, channels: 4 } }).png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }).catch(() => null)
  if (!trimmed) return { key, error: 'nothing left after cutting' }
  let art = trimmed.data
  if (o.label) {
    how += ', name set beside the icon'
    const H = 200
    const icon = await sharp(art).resize({ height: H }).toBuffer({ resolveWithObject: true })
    const esc = o.label.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    const text = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="${H}"><text x="0" y="${H * 0.68}" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${H * 0.56}" letter-spacing="1" fill="#fff">${esc}</text></svg>`)).png().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
    const gap = Math.round(H * 0.22)
    art = await sharp({ create: { width: icon.info.width + gap + text.info.width, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: icon.data, left: 0, top: 0 }, { input: text.data, left: icon.info.width + gap, top: Math.round((H - text.info.height) / 2) }])
      .png()
      .toBuffer()
  }
  const out = await sharp(art)
    .resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true })
  await writeFile(path.join(outDir, `${key}.png`), out.data)

  // how much of the trimmed box is ink: near 1 means a filled badge, not a logo shape
  const fill = (await sharp(out.data).extractChannel(3).stats()).channels[0].mean / 255
  const warnings = []
  if (!svg && trimmed.info.height < 90) warnings.push(`small source (${trimmed.info.width}x${trimmed.info.height})`)
  if (fill > 0.72) warnings.push('mostly solid: looks like a filled block')
  if (fill < 0.03) warnings.push('almost empty')
  return { key, source: `${meta.format} ${meta.width}x${meta.height}`, how, out: `${out.info.width}x${out.info.height}`, fill: Number(fill.toFixed(2)), warnings }
}

const files = (await readdir(inDir)).filter((f) => /\.(svg|png|webp|jpg|gif|avif)$/i.test(f) && !f.endsWith('.shot.png'))
const report = []
for (const f of files.sort()) {
  const r = await whiten(f).catch((e) => ({ key: f, error: e.message }))
  report.push(r)
  console.log(r.error ? `FAIL ${r.key} ${r.error}` : `ok   ${r.key.padEnd(34)} ${r.source.padEnd(18)} → ${r.out.padEnd(9)} ${r.how}${r.warnings.length ? '  ! ' + r.warnings.join('; ') : ''}`)
}
await writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 1))
