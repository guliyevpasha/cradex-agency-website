/**
 * One-off: copies the built-in "İşlərimiz" samples (ads, SEO, mobile, technical
 * service) into Sanity as workCase entries, all four languages, ticked as
 * "Nümunə" so the site keeps the sample badge. Safe to re-run: existing
 * entries are left alone, so edits made in Studio are never overwritten.
 *   node scripts/seed-work-samples.mjs
 * After the samples change in code, --update rewrites the entries that are
 * still ticked as samples (real cases and unticked ones are never touched).
 * Needs Node 22.18+ (reads lib/site/workSamples.ts) and a real SANITY_WRITE_TOKEN.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createClient } from '@sanity/client'
import { IntlMessageFormat } from 'intl-messageformat'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { AD_SAMPLES, SEO_SAMPLES } from '../lib/site/workSamples.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local') })

const token = process.env.SANITY_WRITE_TOKEN ?? ''
if (token.length < 30 || /your|xxx|placeholder/i.test(token)) {
  console.error('SANITY_WRITE_TOKEN is missing or still the placeholder. Create an Editor token at sanity.io/manage and put it in .env.local.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const LANGS = ['az', 'en', 'ru', 'tr']
const site = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(fs.readFileSync(path.join(root, 'messages', `${l}.json`), 'utf8')).site]))
const get = (obj, keyPath) => keyPath.split('.').reduce((o, k) => o?.[k], obj)

const str = (keyPath) => ({ _type: 'localeString', ...Object.fromEntries(LANGS.map((l) => [l, get(site[l], keyPath)])) })
const txt = (keyPath) => ({ _type: 'localeText', ...Object.fromEntries(LANGS.map((l) => [l, get(site[l], keyPath)])) })
const plural = (keyPath, n) => ({
  _type: 'localeString',
  ...Object.fromEntries(LANGS.map((l) => [l, String(new IntlMessageFormat(get(site[l], keyPath), l).format({ n }))])),
})
const metrics = (list) =>
  list.map(([k, value], i) => ({ _key: `m${i}`, _type: 'metric', label: str(`workSamples.metrics.${k}`), value }))

const docs = []
AD_SAMPLES.forEach((s, i) =>
  docs.push({
    _id: `sample-ads-${i}`,
    category: 'ads',
    platform: s.platform,
    sector: str(`workSamples.sectors.${s.sector}`),
    goal: str(`workSamples.types.${s.type}`),
    period: plural('workSamples.months', s.months),
    text: txt(`workSamples.ads.${i}`),
    metrics: metrics(s.metrics),
    chart: s.bars,
    order: 1000 + i,
  })
)
SEO_SAMPLES.forEach((s, i) =>
  docs.push({
    _id: `sample-seo-${i}`,
    category: 'seo',
    sector: str(`workSamples.sectors.${s.sector}`),
    goal: str(`workSamples.types.${s.type}`),
    period: plural('workSamples.months', s.months),
    text: txt(`workSamples.seo.${i}`),
    metrics: metrics(s.metrics),
    chart: s.line,
    order: 1000 + i,
  })
)
site.az.workPages.mobile.cases.forEach((c, i) =>
  docs.push({
    _id: `sample-mobile-${i}`,
    category: 'mobile',
    kind: c.kind,
    title: str(`workPages.mobile.cases.${i}.title`),
    sector: str(`workPages.mobile.cases.${i}.sector`),
    text: txt(`workPages.mobile.cases.${i}.text`),
    features: c.features.map((_, n) => ({ _key: `f${n}`, ...str(`workPages.mobile.cases.${i}.features.${n}`) })),
    order: 1000 + i,
  })
)
site.az.workPages.support.cases.forEach((c, i) =>
  docs.push({
    _id: `sample-support-${i}`,
    category: 'support',
    group: c.group,
    title: str(`workPages.support.cases.${i}.title`),
    problem: txt(`workPages.support.cases.${i}.problem`),
    solution: txt(`workPages.support.cases.${i}.solution`),
    result: str(`workPages.support.cases.${i}.result`),
    order: 1000 + i,
  })
)

// Every language has to be there, or the entry would show Azerbaijani on other pages.
const complete = (v) =>
  Array.isArray(v)
    ? v.every(complete)
    : v && typeof v === 'object'
      ? (!String(v._type).startsWith('locale') || LANGS.every((l) => typeof v[l] === 'string' && v[l].trim())) && Object.values(v).every(complete)
      : true
const missing = docs.filter((d) => !complete(d)).map((d) => d._id)
if (missing.length) {
  console.error(`Translations missing in ${missing.length} entries, e.g. ${missing[0]}. Fix messages/*.json first.`)
  process.exit(1)
}

if (process.argv.includes('--dry')) {
  console.log(`Dry run: ${docs.length} entries ready, nothing written.`)
  process.exit(0)
}

const found = await client.fetch(`*[_id in $ids]{ _id, sample, published }`, { ids: docs.map((d) => d._id) })
const existing = new Map(found.map((d) => [d._id, d]))
const update = process.argv.includes('--update')
const writes = docs.filter((d) => !existing.has(d._id) || (update && existing.get(d._id).sample === true))
for (let i = 0; i < writes.length; i += 50) {
  const tx = client.transaction()
  for (const d of writes.slice(i, i + 50)) {
    // keep the owner's "Saytda göstər" choice on entries that already exist
    const published = existing.get(d._id)?.published ?? true
    tx.createOrReplace({ _type: 'workCase', sample: true, published, ...d })
  }
  await tx.commit()
}
const created = writes.filter((d) => !existing.has(d._id)).length
console.log(`Done: ${created} created, ${writes.length - created} updated, ${docs.length - writes.length} left as they are.`)
