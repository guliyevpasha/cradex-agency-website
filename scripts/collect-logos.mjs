/**
 * Fetches each client's own logo from their website header, in the best form
 * the site has: the original file (SVG when there is one) or the inline SVG
 * markup. Also saves a 4x element shot for checking by eye.
 *
 *   node scripts/collect-logos.mjs <sites.json> <outDir> [key …]
 *
 * sites.json: [{ "key": "onaktravel-com", "url": "https://onaktravel.com/" }]
 * Writes <key>.<ext>, <key>.shot.png and logos.json (what was found where).
 * @author Paşa Quliyev — Cradex Agency
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const [, , listFile, outDir, ...only] = process.argv
if (!listFile || !outDir) {
  console.error('usage: node scripts/collect-logos.mjs <sites.json> <outDir> [key …]')
  process.exit(1)
}

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const EXT = { 'image/svg+xml': 'svg', 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/avif': 'avif' }
const sites = JSON.parse(await readFile(listFile, 'utf8')).filter((s) => only.length === 0 || only.includes(s.key))
await mkdir(outDir, { recursive: true })

// Marks the most logo-like element in the top of the page and describes it.
function pick() {
  const seen = []
  const score = (n) => {
    const r = n.getBoundingClientRect()
    const st = getComputedStyle(n)
    if (r.width < 24 || r.height < 12 || r.top > 260 || r.bottom < 0 || r.left > innerWidth * 0.7 || st.visibility === 'hidden' || st.display === 'none' || Number(st.opacity) < 0.1) return -1
    if (r.width > 520 || r.height > 220) return -1
    let s = 0
    const own = `${n.id} ${n.className?.baseVal ?? n.className} ${n.getAttribute('alt') ?? ''} ${n.getAttribute('src') ?? ''} ${n.getAttribute('aria-label') ?? ''}`
    if (/logo|brand/i.test(own)) s += 6
    for (let p = n.parentElement, d = 0; p && d < 5; p = p.parentElement, d++) {
      const id = `${p.id} ${p.className?.baseVal ?? p.className}`
      if (/logo|brand/i.test(id)) s += 4
      if (p.tagName === 'A' && /^(\/|\.\/|#|index|https?:\/\/[^/]+\/?([a-z]{2}\/?)?$)/i.test(p.getAttribute('href') ?? '')) s += 3
      if (p.tagName === 'HEADER' || p.tagName === 'NAV') s += 2
    }
    if (/flag|lang|icon|whatsapp|phone|facebook|instagram|youtube|search|cart|user|menu|arrow|banner|slide/i.test(own)) s -= 6
    s += Math.max(0, 3 - r.top / 60) + (r.left < innerWidth * 0.4 ? 1 : 0)
    return s
  }
  for (const n of document.querySelectorAll('img, svg')) {
    if (n.closest('svg') && n.tagName !== 'svg') continue
    if (n.tagName === 'svg' && n.parentElement?.closest('svg')) continue
    const s = score(n)
    if (s > 0) seen.push([s, n])
  }
  seen.sort((a, b) => b[0] - a[0])
  const best = seen[0]?.[1]
  if (!best) return null
  best.setAttribute('data-logo-pick', '1')
  const r = best.getBoundingClientRect()
  const base = { score: seen[0][0], w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) }
  if (best.tagName === 'svg') {
    const clone = best.cloneNode(true)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`)
    // currentColor only means something inside the page
    const color = getComputedStyle(best).color
    return { ...base, kind: 'inline-svg', svg: clone.outerHTML.replace(/currentColor/g, color), usesHref: Boolean(best.querySelector('use')) }
  }
  return { ...base, kind: 'img', src: best.currentSrc || best.src, natural: `${best.naturalWidth}x${best.naturalHeight}`, alt: best.alt }
}

async function collect(browser, site) {
  const out = { key: site.key, url: site.url }
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4, locale: 'az-AZ', ignoreHTTPSErrors: true })
  const page = await ctx.newPage()
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {})
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(2500)
    const found = await page.evaluate(pick)
    if (!found) throw new Error('no logo-like element in the header')
    Object.assign(out, found)
    delete out.svg
    await page.locator('[data-logo-pick]').screenshot({ path: path.join(outDir, `${site.key}.shot.png`), omitBackground: true, timeout: 15000 }).catch(() => {})
    if (found.kind === 'inline-svg') {
      await writeFile(path.join(outDir, `${site.key}.svg`), found.svg)
      out.file = `${site.key}.svg`
    } else if (found.src.startsWith('data:')) {
      const m = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(found.src)
      const ext = EXT[m[1]] ?? 'bin'
      await writeFile(path.join(outDir, `${site.key}.${ext}`), m[2] ? Buffer.from(m[3], 'base64') : decodeURIComponent(m[3]))
      out.file = `${site.key}.${ext}`
      out.src = `data:${m[1]}…`
    } else {
      const res = await ctx.request.get(found.src, { timeout: 30000 })
      const type = (res.headers()['content-type'] ?? '').split(';')[0].trim()
      const ext = EXT[type] ?? (/\.(svg|png|webp|jpe?g|gif|avif)(\?|$)/i.exec(found.src)?.[1] ?? 'bin').replace('jpeg', 'jpg')
      await writeFile(path.join(outDir, `${site.key}.${ext}`), await res.body())
      out.file = `${site.key}.${ext}`
    }
  } catch (e) {
    out.error = String(e.message).split('\n')[0]
  }
  await ctx.close()
  console.log(`${out.error ? 'FAIL' : 'ok  '} ${site.key} ${out.kind ?? ''} ${out.file ?? ''} ${out.natural ?? ''} shown ${out.w ?? '-'}x${out.h ?? '-'} ${out.error ?? ''}`)
  return out
}

const browser = await chromium.launch({ executablePath: CHROME })
const queue = [...sites]
const results = []
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) results.push(await collect(browser, s))
  })
)
await browser.close()
await writeFile(path.join(outDir, 'logos.json'), JSON.stringify(results, null, 1))
