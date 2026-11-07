/**
 * Renders the link preview images (public/og/home-<locale>.jpg, 1200×630).
 * Takes fresh captures of the live home page (desktop in the day theme,
 * phone in the night theme) and places them as 3D devices on the brand
 * scene, with the headline from site.og in each language.
 *   node scripts/render-og.mjs [base-url]
 * Dev only: uses Playwright with the system Chrome and sharp.
 * @author Paşa Quliyev — Cradex Agency
 */
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'
import sharp from 'sharp'

const BASE = process.argv[2] ?? 'https://cradexagency.com'
const LOCALES = ['az', 'en', 'ru', 'tr']
const out = path.resolve('public/og')
fs.mkdirSync(out, { recursive: true })

const icon = (d) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" style="vertical-align:-2px">${d}</svg>`
const SUN = icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>')
const MOON = icon('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>')
const logo = 'data:image/svg+xml;base64,' + fs.readFileSync('public/logo.svg').toString('base64')
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })

async function capture(locale, { width, height, dark, mobile }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
  await page.addInitScript((d) => localStorage.setItem('cradex-theme', d ? 'dark' : 'light'), dark)
  await page.goto(`${BASE}/${locale}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  // floating helpers (robot, back-to-top, bottom bar) would cover the hero
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el)
      if (s.position === 'fixed' && el.getBoundingClientRect().top > 80) el.remove()
    }
  })
  const shot = await page.screenshot({ type: 'jpeg', quality: 90 })
  await page.close()
  return 'data:image/jpeg;base64,' + shot.toString('base64')
}

function html(copy, desk, phone) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;600;800&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:Onest,sans-serif;color:#fff;
  background:radial-gradient(700px 500px at 82% 30%,#24A0FF40,transparent 70%),radial-gradient(600px 400px at 5% 110%,#0A74CC55,transparent 70%),#0B0D10}
.floor{position:absolute;left:-10%;right:-10%;bottom:-260px;height:520px;transform:perspective(700px) rotateX(64deg);
  background:linear-gradient(#24A0FF22 1px,transparent 1px) 0 0/64px 64px,linear-gradient(90deg,#24A0FF22 1px,transparent 1px) 0 0/64px 64px;
  mask-image:linear-gradient(transparent,#000 40%,transparent)}
.ring{position:absolute;left:790px;top:300px;border:1.5px solid #24A0FF55;border-radius:50%;transform:translate(-50%,-50%) rotateX(70deg)}
.copy{position:absolute;left:64px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.logo{width:190px;height:48px;background:#fff;-webkit-mask:url(${logo}) left center/contain no-repeat;margin-bottom:38px}
.eyebrow{font-size:17px;font-weight:600;color:#7CC8FF;letter-spacing:.2px;margin-bottom:16px}
h1{font-size:${copy.size}px;line-height:1.06;font-weight:800;letter-spacing:-1.6px}
h1 b{color:#24A0FF;font-weight:800}
.badge{margin-top:30px;display:inline-flex;align-items:center;gap:12px;align-self:flex-start;padding:13px 22px;border-radius:999px;
  background:#0A74CC;font-size:21px;font-weight:600;box-shadow:0 14px 40px #0A74CC70,inset 0 1px 0 #ffffff40}
.badge i{width:11px;height:11px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px #ffffff33}
.url{margin-top:26px;font-size:18px;color:#ffffff99}
.scene{position:absolute;right:0;top:0;width:660px;height:630px;perspective:1600px}
.laptop{position:absolute;left:110px;top:120px;width:510px;transform:rotateY(-24deg) rotateX(8deg) rotateZ(1deg);transform-style:preserve-3d}
.screen{border-radius:16px 16px 4px 4px;padding:10px;background:#1A1D22;border:1.5px solid #ffffff22;box-shadow:0 40px 80px #000000a0,0 0 90px #24A0FF35}
.screen img{display:block;width:100%;height:298px;object-fit:cover;object-position:top;border-radius:7px}
.base{height:16px;margin:0 -34px;border-radius:0 0 18px 18px;background:linear-gradient(#3A3F47,#1A1D22);box-shadow:0 26px 40px #00000090}
.phone{position:absolute;left:20px;top:215px;width:168px;padding:7px;border-radius:30px;background:#111317;border:1.5px solid #ffffff30;
  transform:rotateY(-14deg) rotateX(6deg) rotateZ(-3deg);box-shadow:-20px 40px 70px #000000c0,0 0 60px #24A0FF40}
.phone img{display:block;width:100%;height:330px;object-fit:cover;object-position:top;border-radius:24px}
.sheen{position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,#ffffff14 50%,transparent 60%);border-radius:inherit;pointer-events:none}
.chip{position:absolute;padding:10px 16px;border-radius:16px;font-size:15px;font-weight:600;background:#ffffff12;border:1px solid #ffffff26;backdrop-filter:blur(10px);box-shadow:0 18px 40px #00000070}
.chip span{color:#24A0FF}
</style></head><body>
<div class="floor"></div>
<div class="ring" style="width:620px;height:620px"></div><div class="ring" style="width:440px;height:440px;border-color:#24A0FF35"></div>
<div class="copy">
  <div class="logo"></div>
  <div class="eyebrow">${copy.eyebrow}</div>
  <h1>${copy.title}</h1>
  <div class="badge"><i></i>${copy.badge}</div>
  <div class="url">cradexagency.com</div>
</div>
<div class="scene">
  <div class="laptop"><div class="screen" style="position:relative"><img src="${desk}"><div class="sheen"></div></div><div class="base"></div></div>
  <div class="phone"><img src="${phone}"><div class="sheen"></div></div>
  <div class="chip" style="left:480px;top:66px">${SUN} / ${MOON}</div>
  <div class="chip" style="left:470px;top:478px"><span>●</span> 4 ${copy.langs}</div>
</div>
</body></html>`
}

for (const locale of LOCALES) {
  const messages = JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8'))
  const og = messages.site.og
  const [desk, phone] = [
    await capture(locale, { width: 1440, height: 840, dark: false, mobile: false }),
    await capture(locale, { width: 390, height: 760, dark: true, mobile: true }),
  ]
  // the last word of the headline is drawn in brand blue
  const title = og.title.replace(/(\S+)$/, '<b>$1</b>')
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
  await page.setContent(html({ ...og, title, size: og.title.length > 46 ? 48 : 56 }, desk, phone), { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png' })
  await page.close()
  const file = path.join(out, `home-${locale}.jpg`)
  await sharp(png).resize(1200, 630).jpeg({ quality: 85, mozjpeg: true }).toFile(file)
  console.log(file, Math.round(fs.statSync(file).size / 1024) + ' KB')
}
await browser.close()
