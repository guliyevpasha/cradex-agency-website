/**
 * One-off: copies the three built-in combo packages (Instagram, TikTok,
 * YouTube) into Sanity so they can be edited in Studio. Safe to re-run: it
 * only creates packages that are not there yet and never overwrites.
 *   node scripts/seed-combo-packages.mjs
 * Needs a real SANITY_WRITE_TOKEN (Editor) in .env.local.
 * @author Paşa Quliyev — Cradex Agency
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

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
const messages = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(fs.readFileSync(path.join(root, 'messages', `${l}.json`), 'utf8')).site.products.combo]))

// Same prices as STATIC_PACKAGES in lib/site/orders.ts.
const PACKAGES = [
  { id: 'instagram', azn: 20, usd: 15 },
  { id: 'tiktok', azn: 20, usd: 15 },
  { id: 'youtube', azn: 35, usd: 25 },
]

const loc = (key) => Object.fromEntries(LANGS.map((l) => [l, messages[l][key]]))

let created = 0
for (const [i, p] of PACKAGES.entries()) {
  const features = messages.az[`${p.id}Features`].map((_, n) => ({
    _key: `f${n}`,
    _type: 'localeString',
    ...Object.fromEntries(LANGS.map((l) => [l, messages[l][`${p.id}Features`][n]])),
  }))
  const doc = {
    // no dots in the id: those would make the package private
    _id: `combo-${p.id}`,
    _type: 'comboPackage',
    title: { _type: 'localeString', ...loc(`${p.id}Title`) },
    slug: { _type: 'slug', current: p.id },
    platform: p.id,
    azn: p.azn,
    usd: p.usd,
    features,
    active: true,
    order: i,
  }
  const before = await client.getDocument(doc._id)
  if (before) {
    console.log(`= ${p.id} already in Sanity, left as it is`)
    continue
  }
  await client.createIfNotExists(doc)
  created++
  console.log(`+ ${p.id}`)
}
console.log(`Done: ${created} package(s) created.`)
