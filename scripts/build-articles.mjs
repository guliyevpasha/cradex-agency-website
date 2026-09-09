/**
 * Builds the Sanity import bundle from the article sources.
 *
 *   node scripts/build-articles.mjs
 *
 * Reads every module in `content/articles/`, renders a cover for each, converts
 * the four markdown bodies to Portable Text, and writes
 * `content/import/articles.ndjson` plus `content/import/covers/*.png`.
 *
 * The NDJSON references each cover with Sanity's `_sanityAsset` convention, so
 * `sanity dataset import` uploads the images itself — no write token has to be
 * created or handed around. `_id` is derived from the slug, which makes a
 * re-import with `--replace` an update rather than a duplicate.
 */

import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import { markdownToPortableText, readingTime, wordCount } from './lib/portable-text.mjs'
import { coverSvg } from './lib/cover.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(ROOT, 'content', 'articles')
const OUT_DIR = join(ROOT, 'content', 'import')
const COVER_DIR = join(OUT_DIR, 'covers')

const LOCALES = ['az', 'en', 'ru', 'tr']

function fail(msg) {
  console.error(`✗ ${msg}`)
  process.exitCode = 1
}

async function loadArticles() {
  let files = []
  try {
    files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.mjs')).sort()
  } catch {
    throw new Error(`No article sources found at ${SRC_DIR}`)
  }

  const articles = []
  for (const file of files) {
    const mod = await import(pathToFileURL(join(SRC_DIR, file)).href)
    articles.push({ file, ...mod.default })
  }
  return articles
}

function validate(a) {
  const problems = []
  if (!a.slug) problems.push('missing slug')
  if (!a.category) problems.push('missing category')
  for (const loc of LOCALES) {
    if (!a.title?.[loc]?.trim()) problems.push(`title.${loc} missing`)
    if (!a.excerpt?.[loc]?.trim()) problems.push(`excerpt.${loc} missing`)
    if (!a.body?.[loc]?.trim()) problems.push(`body.${loc} missing`)
  }
  return problems
}

async function main() {
  const articles = await loadArticles()
  if (!articles.length) throw new Error('No articles to build')

  await mkdir(COVER_DIR, { recursive: true })

  const lines = []
  const seenSlugs = new Set()
  const report = []

  for (const a of articles) {
    const problems = validate(a)
    if (problems.length) {
      fail(`${a.file}: ${problems.join(', ')}`)
      continue
    }
    if (seenSlugs.has(a.slug)) {
      fail(`${a.file}: duplicate slug "${a.slug}"`)
      continue
    }
    seenSlugs.add(a.slug)

    // Cover
    const svg = coverSvg(a.slug, a.category)
    // WebP, not PNG: sharp's png({quality}) quantises to a 256-colour palette,
    // which dithered a visible speckled patch into every smooth gradient.
    await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(join(COVER_DIR, `${a.slug}.webp`))

    // Body → Portable Text
    const content = {}
    const words = {}
    for (const loc of LOCALES) {
      content[loc] = markdownToPortableText(a.body[loc])
      words[loc] = wordCount(a.body[loc])
    }

    lines.push(
      JSON.stringify({
        _id: `blog-${a.slug}`,
        _type: 'blog',
        title: pick(a.title),
        slug: { _type: 'slug', current: a.slug },
        author: a.author ?? 'Cradex Agency',
        category: a.category,
        excerpt: pick(a.excerpt),
        content,
        publishedAt: new Date(`${a.publishedAt}T09:00:00Z`).toISOString(),
        readingTime: a.readingTime ?? readingTime(a.body.az),
        mainImage: { _sanityAsset: `image@file://./covers/${a.slug}.webp` },
      })
    )

    report.push({ slug: a.slug, category: a.category, words })
  }

  await writeFile(join(OUT_DIR, 'articles.ndjson'), lines.join('\n') + '\n', 'utf8')

  console.log(`\n✓ ${lines.length} article(s) → content/import/articles.ndjson\n`)
  console.log('slug'.padEnd(42), 'category'.padEnd(20), 'words az/en/ru/tr')
  console.log('-'.repeat(96))
  for (const r of report) {
    console.log(
      r.slug.padEnd(42),
      r.category.padEnd(20),
      `${r.words.az}/${r.words.en}/${r.words.ru}/${r.words.tr}`
    )
  }
  const byCategory = report.reduce((acc, r) => ({ ...acc, [r.category]: (acc[r.category] ?? 0) + 1 }), {})
  console.log('\nper category:', JSON.stringify(byCategory))
}

function pick(obj) {
  return { az: obj.az, en: obj.en, ru: obj.ru, tr: obj.tr }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
