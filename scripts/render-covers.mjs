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

// What the interface sketch shows, picked from the slug so posts in one
// category still get different pictures.
const KINDS = [
  [/suret|vitals|speed/, 'gauge'],
  [/tehlukesiz|security|hack|hesab/, 'shield'],
  [/crm/, 'kanban'],
  [/avtomat|automation|proses/, 'flow'],
  [/yerli|local/, 'map'],
  [/magaza|store|landing|korporativ/, 'store'],
  [/flutter|native/, 'code'],
  [/app-store|play/, 'phone'],
  [/geo|aeo|chatgpt/, 'chat'],
  [/texniki|backlink|link/, 'list'],
  [/tiktok/, 'phone'],
  [/catbot/, 'chat'],
  [/qiymet/, 'browser'],
]
const kindOf = (a) => KINDS.find(([re]) => re.test(a.slug))?.[1] ?? a.category

function sketch(kind, a) {
  const bar = (w, o = 1) => `<i style="width:${w}%;opacity:${o}"></i>`
  switch (kind) {
    case 'gauge':
      return `<div class="gauge"><svg viewBox="0 0 200 120"><path d="M20 110 A80 80 0 0 1 180 110" stroke="#ffffff22" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M20 110 A80 80 0 0 1 160 55" stroke="${a}" stroke-width="18" fill="none" stroke-linecap="round"/><line x1="100" y1="110" x2="150" y2="62" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="110" r="10" fill="#fff"/></svg>${bar(50)}${bar(30, 0.5)}</div>`
    case 'shield':
      return `<div class="shieldv"><svg viewBox="0 0 120 140"><path d="M60 8 L108 26 V70 C108 102 86 124 60 132 C34 124 12 102 12 70 V26 Z" fill="${a}33" stroke="${a}" stroke-width="5"/><path d="M38 70 L54 86 L84 54" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><div>${bar(90)}${bar(70, 0.6)}${bar(80, 0.4)}</div></div>`
    case 'kanban':
      return `<div class="kanban">${[3, 2, 1].map((n, c) => `<div><em style="background:${c ? '#ffffff30' : a}"></em>${'<b></b>'.repeat(n)}</div>`).join('')}</div>`
    case 'flow':
      return `<div class="flow"><b style="background:${a}"></b><u></u><b></b><u></u><b></b><u></u><b style="background:${a}99"></b></div>`
    case 'map':
      return `<div class="minimap"><span class="road r1"></span><span class="road r2"></span><span class="mpin" style="background:${a}"></span></div>`
    case 'store':
      return `<div class="store">${[0, 1, 2, 3, 4, 5].map((i) => `<div><b style="${i === 1 ? 'background:' + a + '66' : ''}"></b>${bar(70)}${bar(40, 0.5)}</div>`).join('')}</div>`
    case 'code':
      return `<div class="code">${[[10, 40], [20, 55], [20, 35], [30, 50], [20, 25], [10, 30]].map(([ml, w], i) => `<i style="margin-left:${ml}%;width:${w}%;background:${i % 3 === 1 ? a : '#ffffff40'}"></i>`).join('')}</div>`

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

function html(article, variant) {
  const rnd = seeded(article.slug)
  const [a, a2] = ACCENT[article.category] ?? ACCENT['web-dev']
  const kind = kindOf(article)
  const iconName = article.cover?.icon ?? 'Sparkles'
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
.gauge svg{width:72%;display:block;margin:10px auto 18px}.gauge i{margin-left:auto;margin-right:auto}
.shieldv{display:grid;grid-template-columns:150px 1fr;gap:34px;align-items:center;height:100%}.shieldv i{display:block;height:16px;border-radius:8px;background:#ffffff40;margin:16px 0}
.kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;height:100%}.kanban em{display:block;height:12px;width:60%;border-radius:6px;margin-bottom:16px}.kanban b{display:block;height:70px;border-radius:16px;background:#ffffff14;margin-bottom:14px}
.flow{display:flex;align-items:center;height:100%}.flow b{width:84px;height:84px;border-radius:24px;background:#ffffff1c;flex-shrink:0}.flow u{flex:1;height:4px;background:repeating-linear-gradient(90deg,#ffffff60 0 12px,transparent 12px 22px)}
.minimap{position:relative;height:100%;border-radius:20px;overflow:hidden;background:linear-gradient(#ffffff0d 2px,transparent 2px) 0 0/100% 46px,linear-gradient(90deg,#ffffff0d 2px,transparent 2px) 0 0/46px 100%}.road{position:absolute;background:#ffffff30;border-radius:8px}.r1{left:-5%;right:-5%;top:55%;height:18px;transform:rotate(-8deg)}.r2{top:-5%;bottom:-5%;left:40%;width:18px;transform:rotate(12deg)}.mpin{position:absolute;left:42%;top:30%;width:70px;height:70px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 0 40px ${a}}
.store{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.store b{display:block;height:80px;border-radius:14px;background:#ffffff14;margin-bottom:6px}
.code i{display:block;height:16px;border-radius:8px;margin:20px 0}
.orb{position:absolute;left:34%;top:50%;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;
  background:radial-gradient(circle at 34% 28%,#ffffffcc 0,${a2} 14%,${a} 42%,#0A1A33 78%);box-shadow:0 0 160px ${a}88,inset -40px -60px 120px #00000080;display:flex;align-items:center;justify-content:center}
.orb svg{filter:drop-shadow(0 10px 30px #00000060)}
.side{position:absolute;right:6%;top:50%;width:520px;height:370px;transform:translateY(-50%) perspective(1400px) rotateY(-24deg) rotateX(6deg)}
.iso{position:absolute;left:30%;top:58%;transform:translate(-50%,-50%) rotateX(58deg) rotateZ(-42deg);transform-style:preserve-3d;display:grid;grid-template-columns:repeat(5,120px);gap:20px}
.iso b{height:120px;border-radius:26px;background:linear-gradient(145deg,#ffffff16,#ffffff06);border:1.5px solid #ffffff1c;box-shadow:0 30px 40px #00000050}
.iso b.up{background:linear-gradient(145deg,${a2},${a});box-shadow:0 0 70px ${a}aa,0 40px 50px #00000070;transform:translateZ(70px);display:flex;align-items:center;justify-content:center}
.iso b.up svg{transform:rotate(42deg)}
.iso b.mid{background:${a}55;transform:translateZ(34px)}
.tall{position:absolute;right:6%;top:13%;width:540px;height:360px}
.solo{position:absolute;inset:0}
</style></head><body><div class="scene">
<div class="floor"></div>
${variant === 'orb' ? `<div class="rings" style="left:34%"><div></div><div></div><div></div></div><div class="orb">${svg(iconName, 170, '#ffffff', 1.5)}</div><div class="side"><div class="card front solo">${sketch(kind, a)}</div></div>` : ''}
${variant === 'iso' ? `<div class="glow" style="left:30%;top:60%"></div><div class="iso">${Array.from({ length: 20 }, (_, i) => (i === 7 ? `<b class="up">${svg(iconName, 76, '#ffffff', 1.8)}</b>` : [2, 11, 13].includes(i) ? '<b class="mid"></b>' : '<b></b>')).join('')}</div><div class="tall"><div class="card front solo">${sketch(kind, a)}</div></div>` : ''}
${variant === 'stack' ? `<div class="rings"><div></div><div></div><div></div>${nodes.map((d, i) => `<span class="node" style="transform:rotate(${d}deg) translate(${[490, 370, 240][i % 3]}px)"></span>`).join('')}</div>
<div class="glow" style="left:${x}%"></div>
<div class="stage"><div class="stack">
  <div class="card back"></div>
  <div class="card mid"></div>
  <div class="card front">${sketch(kind, a)}</div>
  <div class="badge">${svg(iconName, 96, '#ffffff', 1.7)}</div>
</div></div>` : ''}
<div class="chip" style="left:${12 + rnd() * 6}%;top:${18 + rnd() * 8}%;transform:rotate(${rnd() * 16 - 8}deg)">${svg(side[0], 44, a2)}</div>
<div class="chip" style="left:${18 + rnd() * 6}%;top:${62 + rnd() * 8}%;transform:rotate(${rnd() * 16 - 8}deg) scale(.85)">${svg(side[1], 44, '#ffffff')}</div>
<div class="chip" style="right:${5 + rnd() * 4}%;top:${8 + rnd() * 6}%;transform:rotate(${rnd() * 16 - 8}deg) scale(.75)">${svg(side[2], 44, a2)}</div>
<div class="noise"></div>
</div></body></html>`
}

// Posts of one category take turns between three compositions.
const VARIANTS = ['stack', 'orb', 'iso']
const seen = {}
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('owner-y') && !f.startsWith('owner-a'))
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
for (const f of files) {
  const article = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  if (!article.slug || !article.category) continue
  const n = (seen[article.category] = (seen[article.category] ?? -1) + 1)
  await page.setContent(html(article, VARIANTS[n % VARIANTS.length]), { waitUntil: 'load' })
  const png = await page.screenshot({ type: 'png' })
  await sharp(png).webp({ quality: 85 }).toFile(path.join(out, `${article.slug}.webp`))
  console.log('cover', article.slug)
}
await browser.close()
