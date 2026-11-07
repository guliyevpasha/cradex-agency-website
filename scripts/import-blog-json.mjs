/**
 * Imports blog posts written as JSON (title / excerpt / markdown body in four
 * languages, category, services) into Sanity with their cover image.
 *   node scripts/import-blog-json.mjs <articles-dir> <covers-dir> [--dry]
 * Covers come from scripts/render-covers.mjs (<slug>.webp). A post with a
 * "replaces" field overwrites that existing post (same id, new slug);
 * every other post is stored as post-<slug>, so re-running updates it.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { markdownToPortableText, readingTime } from './lib/portable-text.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local') })

const [dir, covers] = process.argv.slice(2)
const dry = process.argv.includes('--dry')
if (!dir || !covers) {
  console.error('Usage: node scripts/import-blog-json.mjs <articles-dir> <covers-dir> [--dry]')
  process.exit(1)
}

const token = process.env.SANITY_WRITE_TOKEN ?? ''
if (!dry && (token.length < 30 || /your|xxx|placeholder/i.test(token))) {
  console.error('SANITY_WRITE_TOKEN is missing or still the placeholder.')
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
const CATEGORIES = ['web-dev', 'mobile', 'seo', 'ads', 'support', 'ai']
const SERVICES = ['web', 'mobile', 'seo', 'ads', 'support', 'chatbot', 'combo']

const files = fs
  .readdirSync(dir)
  .filter((f) => /^(web-dev|mobile|seo|ads|support|ai|owner)-\d+\.json$/.test(f))
  .sort()

const problems = []
const posts = files.map((f) => {
  const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const where = `${f} (${a.slug})`
  if (!/^[a-z0-9-]{3,80}$/.test(a.slug ?? '')) problems.push(`${where}: bad slug`)
  if (!CATEGORIES.includes(a.category)) problems.push(`${where}: unknown category ${a.category}`)
  if (!(a.services ?? []).every((s) => SERVICES.includes(s))) problems.push(`${where}: unknown service`)
  for (const l of LANGS) {
    if (!a.title?.[l] || !a.excerpt?.[l] || !a.body?.[l]) problems.push(`${where}: ${l} missing`)
  }
  if (!fs.existsSync(path.join(covers, `${a.slug}.webp`))) problems.push(`${where}: no cover`)
  return { file: f, ...a }
})
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
if (dry) {
  for (const p of posts) console.log(`${p.category.padEnd(8)} ${p.slug}  ${readingTime(p.body.az)} min`)
  console.log(`Dry run: ${posts.length} posts ready, nothing written.`)
  process.exit(0)
}

const existing = new Map(
  (await client.fetch(`*[_type == "blog" && _id in $ids]{ _id, publishedAt, author, featured }`, { ids: posts.map((p) => p.replaces).filter(Boolean) })).map((d) => [d._id, d])
)

// New posts get today's date a few minutes apart, so the newest category order stays stable.
const now = Date.now()
for (const [i, p] of posts.entries()) {
  const asset = await client.assets.upload('image', fs.createReadStream(path.join(covers, `${p.slug}.webp`)), {
    filename: `${p.slug}.webp`,
  })
  const old = p.replaces ? existing.get(p.replaces) : undefined
  const doc = {
    _id: p.replaces ?? `post-${p.slug}`,
    _type: 'blog',
    title: Object.fromEntries(LANGS.map((l) => [l, p.title[l]])),
    slug: { _type: 'slug', current: p.slug },
    author: old?.author ?? 'Cradex Agency',
    mainImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    category: p.category,
    services: p.services,
    featured: old?.featured ?? false,
    excerpt: Object.fromEntries(LANGS.map((l) => [l, p.excerpt[l]])),
    content: Object.fromEntries(LANGS.map((l) => [l, markdownToPortableText(p.body[l])])),
    publishedAt: old?.publishedAt ?? new Date(now - i * 60_000).toISOString(),
    readingTime: readingTime(p.body.az),
  }
  await client.createOrReplace(doc)
  console.log(`${p.replaces ? '~' : '+'} ${p.category.padEnd(8)} ${p.slug}`)
}
console.log(`Done: ${posts.length} posts.`)
