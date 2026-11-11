/**
 * Adds the website clients from scripts/data/web-works.json to the partners
 * wall (Studio → Tərəfdaşlar): one `partner` per client, with the white logo
 * made by scripts/whiten-logos.mjs.
 *
 *   node scripts/seed-partner-logos.mjs <whiteLogosDir>            write DRAFTS
 *   node scripts/seed-partner-logos.mjs <whiteLogosDir> --publish  publish them
 *
 * Ids are partner-web-<key>; a client without a logo file is skipped. New
 * partners are placed after the ones already there, newest project first.
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

const [, , logosDir, ...rest] = process.argv
const publish = rest.includes('--publish')
if (!logosDir) {
  console.error('usage: node scripts/seed-partner-logos.mjs <whiteLogosDir> [--publish]')
  process.exit(1)
}

const token = process.env.SANITY_WRITE_TOKEN ?? ''
if (token.length < 30 || /your|xxx|placeholder/i.test(token)) {
  console.error('SANITY_WRITE_TOKEN is missing or still the placeholder.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
  perspective: 'raw',
})

const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'data', 'web-works.json'), 'utf8'))
// existing entries have no client name in the file: it is read from their document
const names = Object.fromEntries((await client.fetch(`*[_type == "portfolio" && !(_id in path("drafts.**"))]{"slug": slug.current, "name": coalesce(client, title.az)}`)).map((d) => [d.slug, d.name]))
const last = (await client.fetch(`*[_type == "partner"] | order(order desc)[0].order`)) ?? 0

const list = works
  .map((w) => ({ key: w.key, name: (w.client ?? names[w.existing] ?? '').trim(), website: w.url, date: w.date ?? '', file: path.join(logosDir, `${w.key}.png`) }))
  .filter((w) => w.name && fs.existsSync(w.file))
  .sort((a, b) => b.date.localeCompare(a.date))

let done = 0
for (const [i, w] of list.entries()) {
  const id = `partner-web-${w.key}`
  try {
    if (publish) {
      const draft = await client.getDocument(`drafts.${id}`)
      if (!draft) continue
      const { _rev, _updatedAt, ...doc } = draft
      await client.transaction().createOrReplace({ ...doc, _id: id }).delete(`drafts.${id}`).commit()
    } else {
      const asset = await client.assets.upload('image', fs.createReadStream(w.file), { filename: `${w.key}-white.png` })
      await client.createOrReplace({
        _id: `drafts.${id}`,
        _type: 'partner',
        name: w.name,
        logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
        website: w.website,
        order: last + 1 + i,
        active: true,
      })
    }
    done++
    console.log(publish ? 'published' : 'draft', w.name)
  } catch (e) {
    console.error('FAILED', w.key, e.message)
  }
}
console.log(`${done} of ${list.length} ${publish ? 'published' : 'written as drafts'}`)
