/**
 * Shoots client websites for the portfolio mockups: one desktop and one phone
 * capture per site, plus a small "evidence" file (headers, scripts, globals)
 * that the technology list is written from.
 *
 *   node scripts/capture-sites.mjs <sites.json> <outDir> [slug …]
 *   CAPTURE=tablet node scripts/capture-sites.mjs …   only the tablet shot
 *
 * sites.json: [{ "key": "onaktravel-com", "url": "https://onaktravel.com/" }]
 * @author Paşa Quliyev — Cradex Agency
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import sharp from 'sharp'

const [, , listFile, outDir, ...only] = process.argv
if (!listFile || !outDir) {
  console.error('usage: node scripts/capture-sites.mjs <sites.json> <outDir> [key …]')
  process.exit(1)
}

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const TABLET_UA = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const PARALLEL = 4

const sites = JSON.parse(await readFile(listFile, 'utf8')).filter((s) => only.length === 0 || only.includes(s.key))
await mkdir(path.join(outDir, 'evidence'), { recursive: true })

// Cookie bars, chat bubbles and promo pop-ups cover the header on a phone.
const HIDE = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i], [class*="gdpr" i],
  #onetrust-banner-sdk, .cc-window, [class*="popup-overlay" i], [class*="newsletter-popup" i],
  iframe[src*="tawk"], iframe[title*="chat" i], #tidio-chat, .jivo-iframe-container, jdiv, [class*="whatsapp-float" i]
  { display: none !important; visibility: hidden !important; }
`

async function settle(page) {
  await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {})
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {})
  // Some hosts show a "please wait, verifying" screen first and then reload
  // into the site; an empty body means the page is still being built.
  for (let i = 0; i < 10; i++) {
    const state = await page.evaluate(() => {
      const t = document.body?.innerText ?? ''
      return /please wait|being verified|checking your browser|just a moment/i.test(t) ? 'gate' : t.trim().length < 40 && document.images.length < 2 ? 'empty' : 'ok'
    }).catch(() => 'gate')
    if (state === 'ok') break
    await page.waitForTimeout(3000)
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
  }
  await page.addStyleTag({ content: HIDE }).catch(() => {})
  // preloaders and hero sliders need a moment
  await page.waitForTimeout(3500)
  // floating cookie notices, push prompts and opened chat panels, whatever they are called
  await page.evaluate(() => {
    for (const n of document.querySelectorAll('body *')) {
      const st = getComputedStyle(n)
      if (st.position !== 'fixed' && st.position !== 'sticky') continue
      const r = n.getBoundingClientRect()
      if (r.top < innerHeight * 0.3 || r.height > innerHeight * 0.75 || r.height < 30) continue
      const id = `${n.id} ${n.className?.baseVal ?? n.className}`
      const text = n.innerText ?? ''
      const helper = r.height > 150 && r.width < 520 && (/chat|assist|asistan|widget/i.test(id) || /asistan|assistant|köməkçi|yardımçı|mesajınızı yazın|sualınızı yazın/i.test(text))
      if (/cookie|çerez|kuki|gizlilik|notifications|bildiriş/i.test(text) || helper) n.style.setProperty('display', 'none', 'important')
    }
  }).catch(() => {})
  // a hero photo that is still downloading leaves an empty box in the shot
  await page
    .waitForFunction(() => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 80 }).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 12000 })
    .catch(() => {})
  await page.keyboard.press('Escape').catch(() => {})
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
  await page.waitForTimeout(400)
}

async function shoot(page, file, width, clip) {
  // web fonts that never finish loading stall a normal screenshot, so the
  // second try goes straight to the browser
  const png = await page.screenshot({ type: 'png', animations: 'disabled', timeout: 20000, ...(clip ? { clip, fullPage: true } : {}) }).catch(async () => {
    const cdp = await page.context().newCDPSession(page)
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
    return Buffer.from(data, 'base64')
  })
  await sharp(png).resize({ width }).jpeg({ quality: 86, mozjpeg: true }).toFile(file)
}

// Everything the page gives away about how it was built.
function collect() {
  const w = window
  const has = (sel) => Boolean(document.querySelector(sel))
  const abs = (list, attr) => [...list].map((n) => n.getAttribute(attr)).filter(Boolean)
  const classes = new Set()
  document.querySelectorAll('[class]').forEach((n) => String(n.className?.baseVal ?? n.className).split(/\s+/).forEach((c) => c && classes.size < 4000 && classes.add(c)))
  const cls = [...classes]
  const count = (re) => cls.filter((c) => re.test(c)).length
  const text = (document.body?.innerText ?? '').replace(/\s+/g, ' ').trim()
  return {
    title: document.title,
    lang: document.documentElement.lang,
    description: document.querySelector('meta[name="description"]')?.content ?? '',
    siteName: document.querySelector('meta[property="og:site_name"]')?.content ?? '',
    generator: abs(document.querySelectorAll('meta[name="generator"]'), 'content'),
    h1: [...document.querySelectorAll('h1')].map((n) => n.innerText.trim()).filter(Boolean).slice(0, 3),
    nav: [...document.querySelectorAll('nav a, header a')].map((n) => n.innerText.trim()).filter((t) => t && t.length < 40).slice(0, 30),
    text: text.slice(0, 1800),
    scripts: abs(document.scripts, 'src').slice(0, 120),
    styles: abs(document.querySelectorAll('link[rel="stylesheet"]'), 'href').slice(0, 80),
    inlineHints: {
      nextData: has('#__NEXT_DATA__') || has('script[src*="/_next/"]'),
      nextAppRouter: [...document.scripts].some((s) => s.textContent?.includes('self.__next_f')),
      nuxt: Boolean(w.__NUXT__) || has('#__nuxt'),
      gatsby: has('#___gatsby'),
      reactRoot: has('#root') || has('[data-reactroot]'),
      vueApp: has('[data-v-app]') || has('#app[data-server-rendered]') || cls.some((c) => /^v-/.test(c)) || [...document.querySelectorAll('*')].slice(0, 400).some((n) => [...n.attributes].some((a) => a.name.startsWith('data-v-'))),
      angular: has('[ng-version]'),
      svelte: cls.some((c) => /^svelte-/.test(c)),
      astro: has('astro-island') || [...document.querySelectorAll('*')].slice(0, 300).some((n) => [...n.attributes].some((a) => a.name.startsWith('data-astro-'))),
      livewire: has('[wire\\:id]') || Boolean(w.Livewire),
      inertia: has('#app[data-page]'),
      alpine: Boolean(w.Alpine) || has('[x-data]'),
      csrfMeta: has('meta[name="csrf-token"]'),
      wpContent: document.documentElement.innerHTML.includes('/wp-content/'),
      wpJson: has('link[rel="https://api.w.org/"]'),
      elementor: count(/^elementor/),
      woocommerce: cls.some((c) => /^woocommerce/.test(c)),
      wpbakery: count(/^(vc_|wpb_)/),
      divi: count(/^et_pb_/),
      bootstrapClasses: count(/^(col-(xs|sm|md|lg|xl)-\d+|navbar-(toggler|collapse|expand.*)|container-fluid|d-flex|btn-primary)$/),
      tailwindClasses: count(/^(sm|md|lg|xl):|^(flex|grid|px-\d|py-\d|text-(xs|sm|base|lg|xl)|rounded-(lg|xl|2xl|full))$/),
      swiper: has('.swiper, .swiper-container'),
      owl: has('.owl-carousel'),
      slick: has('.slick-slider'),
      aos: has('[data-aos]'),
      fancybox: has('[data-fancybox]'),
      opencart: document.documentElement.innerHTML.includes('index.php?route='),
      tilda: has('.t-records') || has('[class^="t-rec"]'),
      wix: Boolean(w.wixBiSession) || has('meta[name="generator"][content*="Wix"]'),
      shopify: Boolean(w.Shopify),
      webflow: document.documentElement.hasAttribute('data-wf-site'),
      joomla: document.documentElement.innerHTML.includes('/media/jui/') || document.documentElement.innerHTML.includes('/components/com_'),
      drupal: Boolean(w.Drupal),
      bitrix: Boolean(w.BX),
      aspnet: has('input[name="__VIEWSTATE"]') || has('input[name="__RequestVerificationToken"]'),
    },
    globals: {
      jQuery: w.jQuery?.fn?.jquery ?? null,
      bootstrap: w.bootstrap?.Tooltip?.VERSION ?? w.jQuery?.fn?.tooltip?.Constructor?.VERSION ?? null,
      React: w.React?.version ?? null,
      Vue: w.Vue?.version ?? null,
      gsap: w.gsap?.version ?? null,
      Swiper: Boolean(w.Swiper),
      dataLayer: Array.isArray(w.dataLayer),
      fbq: typeof w.fbq === 'function',
      ym: typeof w.ym === 'function',
      wp: Boolean(w.wp),
      axios: Boolean(w.axios),
      Laravel: Boolean(w.Laravel),
      three: Boolean(w.THREE),
      lottie: Boolean(w.lottie || w.bodymovin),
    },
    fonts: [...new Set([getComputedStyle(document.body).fontFamily, ...[...document.querySelectorAll('h1,h2')].slice(0, 3).map((n) => getComputedStyle(n).fontFamily)])],
    googleFonts: abs(document.querySelectorAll('link[href*="fonts.googleapis.com"]'), 'href').slice(0, 5),
  }
}

// Is a menu toggle visible in the top part of the phone screen?
function burger() {
  const sel = 'button, a, div, span, label, i, svg'
  const re = /burger|hamb|toggle|menu-(btn|icon|button|trigger|open)|nav-(btn|icon|trigger|toggle)|navbar-toggler|mobile-menu|menu_btn|bars|offcanvas|drawer|open-menu|menuBtn|mobile-nav/i
  for (const n of document.querySelectorAll(sel)) {
    const id = `${n.id} ${n.className?.baseVal ?? n.className} ${n.getAttribute('aria-label') ?? ''} ${n.getAttribute('data-bs-toggle') ?? ''} ${n.getAttribute('data-toggle') ?? ''}`
    if (!re.test(id)) continue
    const r = n.getBoundingClientRect()
    const s = getComputedStyle(n)
    if (r.width >= 14 && r.width <= 120 && r.height >= 10 && r.top >= 0 && r.bottom <= 160 && r.left >= 0 && r.right <= innerWidth + 1 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.1) {
      return { found: true, match: id.trim().slice(0, 80), top: Math.round(r.top) }
    }
  }
  return { found: false }
}

// Portrait tablet, as the project page shows it between the laptop and the phone.
async function tablet(browser, site) {
  const ctx = await browser.newContext({ viewport: { width: 820, height: 1093 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: TABLET_UA, locale: 'az-AZ', ignoreHTTPSErrors: true })
  const page = await ctx.newPage()
  let error = ''
  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await settle(page)
    await shoot(page, path.join(outDir, `${site.key}-tablet.jpg`), 1230)
  } catch (e) {
    error = String(e.message).split('\n')[0]
  }
  await ctx.close()
  console.log(`${error ? 'FAIL' : 'ok  '} ${site.key} tablet ${error}`)
}

async function capture(browser, site) {
  if (process.env.CAPTURE === 'tablet') return tablet(browser, site)
  const out = { key: site.key, url: site.url }
  const base = path.join(outDir, site.key)

  // desktop
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'az-AZ', ignoreHTTPSErrors: true })
  const page = await desk.newPage()
  try {
    const res = await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    out.status = res?.status()
    out.finalUrl = page.url()
    const h = res?.headers() ?? {}
    out.headers = Object.fromEntries(['server', 'x-powered-by', 'x-generator', 'x-drupal-cache', 'x-shopify-stage', 'x-vercel-id', 'x-nextjs-cache', 'x-nextjs-prerender', 'cf-ray', 'x-litespeed-cache', 'x-turbo-charged-by', 'x-pingback', 'link', 'via', 'x-aspnet-version', 'x-aspnetmvc-version'].filter((k) => h[k]).map((k) => [k, h[k].slice(0, 200)]))
    await settle(page)
    out.cookies = (await desk.cookies()).map((c) => c.name)
    out.page = await page.evaluate(collect).catch(async () => {
      await settle(page)
      return page.evaluate(collect)
    })
    await shoot(page, `${base}-desktop.jpg`, 1920)
  } catch (e) {
    out.desktopError = String(e.message).split('\n')[0]
  }
  await desk.close()

  // phone
  const phone = await browser.newContext({ viewport: { width: 390, height: 845 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: PHONE_UA, locale: 'az-AZ', ignoreHTTPSErrors: true })
  const mob = await phone.newPage()
  try {
    await mob.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await settle(mob)
    // A page that runs a little wider than the phone pushes its menu button
    // off the right edge. A real phone zooms out to fit it; do the same by
    // shooting the full layout width.
    const wide = await mob.evaluate(() => document.documentElement.scrollWidth).catch(() => 390)
    const clip = wide > 392 && wide <= 470 ? { x: 0, y: 0, width: wide, height: Math.round((wide * 845) / 390) } : undefined
    if (clip) out.phoneWidth = wide
    out.burger = await mob.evaluate(burger).catch(() => ({ found: false }))
    await shoot(mob, `${base}-mobile.jpg`, 780, clip)
  } catch (e) {
    out.mobileError = String(e.message).split('\n')[0]
  }
  await phone.close()

  await writeFile(path.join(outDir, 'evidence', `${site.key}.json`), JSON.stringify(out, null, 1))
  console.log(`${out.desktopError || out.mobileError ? 'FAIL' : 'ok  '} ${site.key} ${out.status ?? ''} burger=${out.burger?.found ?? '-'} ${out.desktopError ?? ''} ${out.mobileError ?? ''}`)
}

const browser = await chromium.launch({ executablePath: CHROME })
const queue = [...sites]
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    for (let s = queue.shift(); s; s = queue.shift()) await capture(browser, s).catch((e) => console.log('FAIL', s.key, e.message))
  })
)
await browser.close()
