/**
 * Renders blog cover images (1600×900 WebP) from article JSON files: a dark
 * brand scene with a 3D glass card stack, the article's icon, a small UI
 * sketch for the category and orbit rings. No text on the image, so one
 * cover serves all four languages. Layout details are seeded from the slug.
 *   node scripts/render-covers.mjs <articles-dir> <out-dir>
 * Dev only: uses Playwright with the system Chrome and sharp.
 * @author Paşa Quliyev — Cradex Agency
 */
import fs from 'fs'
import path from 'path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as icons from 'lucide-react'
import { chromium } from 'playwright'
import sharp from 'sharp'

const [dir, out] = process.argv.slice(2)
if (!dir || !out) {
  console.error('Usage: node scripts/render-covers.mjs <articles-dir> <out-dir>')
  process.exit(1)
}
fs.mkdirSync(out, { recursive: true })

const ACCENT = {
  'web-dev': ['#24A0FF', '#7CC8FF'],
  mobile: ['#7C5CFF', '#B9A8FF'],
  seo: ['#22C55E', '#86EFAC'],
  ads: ['#FF5C7A', '#FFB0BF'],
  support: ['#F59E0B', '#FCD34D'],
  ai: ['#00C2FF', '#8BE7FF'],
}

function seeded(slug) {
  let h = 2166136261
  for (const ch of slug) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const svg = (name, size, color, stroke = 1.6) => {
  // the articles name icons in kebab case ("map-pin"), lucide exports PascalCase
  const pascal = String(name).replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())
  const Icon = icons[pascal] ?? icons[name] ?? icons.Sparkles
  return renderToStaticMarkup(createElement(Icon, { size, color, strokeWidth: stroke }))
}

// A small interface sketch on the back card, one per category.
function sketch(category, a) {
  const bar = (w, o = 1) => `<i style="width:${w}%;opacity:${o}"></i>`
  switch (category) {
    case 'mobile':
      return `<div class="phone"><div class="notch"></div>${bar(70)}${bar(45, 0.6)}<div class="tiles"><b></b><b></b><b></b><b></b></div></div>`
    case 'seo':
      return `<div class="serp">${[1, 0.55, 0.4].map((o, i) => `<div class="row" style="opacity:${o}"><em style="background:${i ? '#ffffff30' : a}"></em>${bar(80)}${bar(55, 0.5)}</div>`).join('')}</div>`
    case 'ads':
      return `<div class="chart">${[35, 52, 44, 68, 61, 84, 100].map((h) => `<s style="height:${h}%"></s>`).join('')}</div>`
    case 'support':
      return `<div class="list">${[0, 1, 2, 3].map(() => `<div class="ok"><em></em>${bar(70)}</div>`).join('')}</div>`
    case 'ai':
      return `<div class="chat"><p class="l">${bar(80)}${bar(50, 0.6)}</p><p class="r">${bar(70)}</p><p class="l">${bar(90)}${bar(40, 0.6)}</p></div>`
    default:
      return `<div class="browser"><div class="dots"><u></u><u></u><u></u></div><div class="hero">${bar(60)}${bar(40, 0.6)}<span></span></div><div class="cols"><b></b><b></b><b></b></div></div>`
  }
}

function html(article) {
  const rnd = seeded(article.slug)
  const [a, a2] = ACCENT[article.category] ?? ACCENT['web-dev']
  const ry = -18 - rnd() * 14
  const rx = 8 + rnd() * 8
  const x = 52 + rnd() * 8
  const ringTilt = 62 + rnd() * 12
  const nodes = Array.from({ length: 5 }, () => rnd() * 360)
  const side = ['TrendingUp', 'Zap', 'Target', 'Sparkles', 'Search', 'MessageCircle', 'ShieldCheck', 'Layers'].sort(() => rnd() - 0.5).slice(0, 3)
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
html,body{width:1600px;height:900px;overflow:hidden;background:#0B0D10}
.scene{position:relative;width:100%;height:100%;overflow:hidden;
  background:radial-gradient(900px 600px at ${x + 8}% 40%, ${a}38, transparent 65%),
  radial-gradient(700px 500px at 12% 90%, #24A0FF22, transparent 70%),
  radial-gradient(600px 420px at 95% 0%, ${a2}22, transparent 70%),
  linear-gradient(160deg,#0E1420 0%,#0B0D10 55%,#080A0D 100%)}
.floor{position:absolute;left:-20%;right:-20%;bottom:-30%;height:75%;transform:perspective(900px) rotateX(72deg);
  background-image:linear-gradient(${a}55 1.5px,transparent 1.5px),linear-gradient(90deg,${a}55 1.5px,transparent 1.5px);background-size:80px 80px;
  -webkit-mask-image:linear-gradient(to top,#000 10%,transparent 85%)}
.noise{position:absolute;inset:0;opacity:.05;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:3px 3px}
.rings{position:absolute;left:${x}%;top:50%;width:980px;height:980px;margin:-490px 0 0 -490px;transform:rotateX(${ringTilt}deg) rotateZ(${rnd() * 40 - 20}deg);transform-style:preserve-3d}
.rings div{position:absolute;inset:0;border-radius:50%;border:1.5px solid ${a}40}
.rings div:nth-child(2){inset:120px;border-color:#ffffff1c}
.rings div:nth-child(3){inset:250px;border:2px dashed ${a2}38}
.node{position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px;border-radius:50%;background:${a2};box-shadow:0 0 24px ${a},0 0 6px #fff}
.stage{position:absolute;left:${x}%;top:50%;transform:translate(-50%,-50%);perspective:1600px}
.stack{position:relative;width:620px;height:420px;transform:rotateY(${ry}deg) rotateX(${rx}deg);transform-style:preserve-3d}
.card{position:absolute;inset:0;border-radius:36px;border:1.5px solid #ffffff26;
  background:linear-gradient(145deg,#ffffff1f,#ffffff08 55%,#ffffff05);backdrop-filter:blur(18px);
  box-shadow:0 60px 120px #00000080, inset 0 1px 0 #ffffff40}
.card.back{transform:translateZ(-180px) translate(120px,-90px);background:linear-gradient(145deg,${a}30,#ffffff05)}
.card.mid{transform:translateZ(-90px) translate(60px,-45px);opacity:.85}
.card.front{transform:translateZ(0);padding:44px;background:linear-gradient(145deg,#1B2433f2,#121925f2 60%,#0F151Ef2)}
.card.front:after{content:'';position:absolute;inset:0;border-radius:36px;background:linear-gradient(160deg,#ffffff1c,transparent 40%);pointer-events:none}
.glow{position:absolute;left:50%;top:50%;width:760px;height:560px;margin:-280px 0 0 -380px;border-radius:50%;background:${a};filter:blur(120px);opacity:.42}
.badge{position:absolute;left:-80px;bottom:-70px;transform:translateZ(140px);width:190px;height:190px;border-radius:52px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(150deg,${a2},${a} 55%,#0A74CC);box-shadow:0 30px 80px ${a}90, inset 0 2px 0 #ffffff80, inset 0 -10px 30px #00000040}
.chip{position:absolute;width:96px;height:96px;border-radius:28px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(150deg,#ffffff26,#ffffff0a);border:1.5px solid #ffffff30;box-shadow:0 24px 60px #00000070;backdrop-filter:blur(12px)}
.back i,.phone i,.serp i,.list i,.chat i,.hero i{display:block;height:14px;border-radius:8px;background:#ffffff40;margin:10px 0}
.browser .dots{display:flex;gap:10px;margin-bottom:26px}.browser u{width:14px;height:14px;border-radius:50%;background:#ffffff40}
.browser .hero span{display:block;width:140px;height:40px;border-radius:20px;background:${a};margin-top:20px}
.browser .cols{display:flex;gap:16px;margin-top:30px}.browser b{flex:1;height:90px;border-radius:16px;background:#ffffff14}
.phone{width:210px;height:330px;margin:-10px auto 0;border-radius:36px;border:2px solid #ffffff40;padding:46px 22px}
.phone .notch{position:absolute;margin:-30px 0 0 55px;width:60px;height:10px;border-radius:6px;background:#ffffff40}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:22px}.tiles b{height:70px;border-radius:16px;background:${a}55}
.serp .row{display:grid;grid-template-columns:44px 1fr;column-gap:16px;margin-bottom:26px}.serp em{grid-row:span 2;width:44px;height:44px;border-radius:12px}
.chart{display:flex;align-items:flex-end;gap:18px;height:300px;padding-top:20px}.chart s{flex:1;border-radius:12px 12px 4px 4px;background:linear-gradient(${a2},${a})}
.list .ok{display:grid;grid-template-columns:34px 1fr;gap:16px;align-items:center;margin-bottom:22px}.list em{width:34px;height:34px;border-radius:50%;background:${a}}
.chat p{width:62%;padding:10px 22px;border-radius:24px;margin-bottom:20px;background:#ffffff14}.chat p.r{margin-left:auto;background:${a}66}
</style></head><body><div class="scene">
<div class="floor"></div>
<div class="rings"><div></div><div></div><div></div>${nodes.map((d, i) => `<span class="node" style="transform:rotate(${d}deg) translate(${[490, 370, 240][i % 3]}px)"></span>`).join('')}</div>
<div class="glow" style="left:${x}%"></div>
<div class="stage"><div class="stack">
  <div class="card back"></div>
  <div class="card mid"></div>
  <div class="card front">${sketch(article.category, a)}</div>
  <div class="badge">${svg(article.cover?.icon ?? 'Sparkles', 96, '#ffffff', 1.7)}</div>
</div></div>
<div class="chip" style="left:${12 + rnd() * 6}%;top:${18 + rnd() * 8}%;transform:rotate(${rnd() * 16 - 8}deg)">${svg(side[0], 44, a2)}</div>
<div class="chip" style="left:${18 + rnd() * 6}%;top:${62 + rnd() * 8}%;transform:rotate(${rnd() * 16 - 8}deg) scale(.85)">${svg(side[1], 44, '#ffffff')}</div>
<div class="chip" style="right:${5 + rnd() * 4}%;top:${8 + rnd() * 6}%;transform:rotate(${rnd() * 16 - 8}deg) scale(.75)">${svg(side[2], 44, a2)}</div>
<div class="noise"></div>
</div></body></html>`
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('owner-y') && !f.startsWith('owner-a'))
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
for (const f of files) {
  const article = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  if (!article.slug || !article.category) continue
  await page.setContent(html(article), { waitUntil: 'load' })
  const png = await page.screenshot({ type: 'png' })
  await sharp(png).webp({ quality: 85 }).toFile(path.join(out, `${article.slug}.webp`))
  console.log('cover', article.slug)
}
await browser.close()
