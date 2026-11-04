/**
 * Builds the favicon set from the logo mark: a white mark on a brand-blue
 * rounded square with a thin light rim, so it reads on white, dark and
 * coloured browser tabs alike.
 *   node scripts/make-icons.mjs
 * Writes app/icon.png, app/apple-icon.png and app/favicon.ico.
 * @author Paşa Quliyev — Cradex Agency
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const SOURCE = 'public/logos/cradex.svg'

async function whiteMark(size) {
  const alpha = await sharp(SOURCE, { density: 72 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extractChannel('alpha')
    .toBuffer()
  return sharp({ create: { width: size, height: size, channels: 3, background: '#FFFFFF' } })
    .joinChannel(alpha)
    .png()
    .toBuffer()
}

/** rounded = false gives a full square (iOS rounds the corners itself). */
async function icon(size, { rounded = true } = {}) {
  const r = rounded ? Math.round(size * 0.24) : 0
  const rim = Math.max(1, Math.round(size * 0.03))
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#24A0FF"/><stop offset="1" stop-color="#0A74CC"/>
  </linearGradient></defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  ${rounded ? `<rect x="${rim / 2}" y="${rim / 2}" width="${size - rim}" height="${size - rim}" rx="${r - rim / 2}" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="${rim}"/>` : ''}
</svg>`)
  // Small icons get a bigger mark: at 16px every pixel counts.
  const markSize = Math.round(size * (size <= 32 ? 0.8 : 0.68))
  const mark = await whiteMark(markSize)
  const offset = Math.round((size - markSize) / 2)
  return sharp(bg).composite([{ input: mark, left: offset, top: offset }]).png().toBuffer()
}

/** ICO file holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  const dir = Buffer.alloc(16 * images.length)
  let offset = 6 + dir.length
  images.forEach(({ size, data }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o)
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1)
    dir.writeUInt8(0, o + 2)
    dir.writeUInt8(0, o + 3)
    dir.writeUInt16LE(1, o + 4)
    dir.writeUInt16LE(32, o + 6)
    dir.writeUInt32LE(data.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += data.length
  })
  return Buffer.concat([header, dir, ...images.map((x) => x.data)])
}

await writeFile('app/icon.png', await icon(512))
await writeFile('app/apple-icon.png', await icon(180, { rounded: false }))
const sizes = [16, 32, 48]
await writeFile('app/favicon.ico', ico(await Promise.all(sizes.map(async (size) => ({ size, data: await icon(size) })))))
console.log('icons written')
