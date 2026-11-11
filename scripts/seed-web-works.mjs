/**
 * Puts the website projects from scripts/data/web-works.json into Sanity
 * (Studio → İşlərimiz → Veb saytlar) with their desktop / phone captures.
 *
 *   node scripts/seed-web-works.mjs <shotsDir>            write DRAFTS only
 *   node scripts/seed-web-works.mjs <shotsDir> --publish  publish those drafts
 *   node scripts/seed-web-works.mjs <shotsDir> key1 key2  only these entries
 *   node scripts/seed-web-works.mjs <shotsDir> --patch    add work list + tablet
 *                                                         capture to existing drafts
 *
 * Drafts are invisible on the live site, so the batch can be reviewed on the
 * local dev server first (SANITY_PREVIEW_DRAFTS=1). New projects get the id
 * web-<slug>; entries marked "existing" update the document that already has
 * that slug (field, technologies, captures, date) and keep everything else.
 * A re-run rewrites the drafts it touches, so name the keys once drafts have
 * been edited in Studio. Captures come from scripts/capture-sites.mjs.
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

const [, , shotsDir, ...rest] = process.argv
const publish = rest.includes('--publish')
const patch = rest.includes('--patch')
const only = rest.filter((a) => !a.startsWith('--'))
if (!shotsDir) {
  console.error('usage: node scripts/seed-web-works.mjs <shotsDir> [--publish]')
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

const works = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'data', 'web-works.json'), 'utf8')).filter((w) => only.length === 0 || only.includes(w.key))

const image = (id) => ({ _type: 'image', asset: { _type: 'reference', _ref: id } })

async function upload(key, kind) {
  const file = path.join(shotsDir, `${key}-${kind}.jpg`)
  if (!fs.existsSync(file)) return null
  const asset = await client.assets.upload('image', fs.createReadStream(file), { filename: `${key}-${kind}.jpg` })
  return asset._id
}

async function targetId(w) {
  if (!w.existing) return `web-${w.slug}`
  const id = await client.fetch(`*[_type == "portfolio" && slug.current == $s && !(_id in path("drafts.**"))][0]._id`, { s: w.existing })
  if (!id) throw new Error(`no published document with slug ${w.existing}`)
  return id
}

async function writeDraft(w) {
  const id = await targetId(w)
  const desktop = await upload(w.key, 'desktop')
  const mobile = await upload(w.key, 'mobile')
  if (!desktop || !mobile) throw new Error('capture missing')

  const tablet = await upload(w.key, 'tablet')
  const shots = { websiteScreenshots: { desktop: image(desktop), ...(tablet ? { tablet: image(tablet) } : {}), mobile: image(mobile) } }
  const common = { industry: w.industry, tools: w.tools, workDone: w.workDone ?? [], ...shots, ...(w.date ? { completedAt: w.date } : {}) }

  if (w.existing) {
    // start from the open draft if there is one, else from the published version
    const base = (await client.getDocument(`drafts.${id}`)) ?? (await client.getDocument(id))
    const { _rev, _updatedAt, ...rest } = base
    await client.createOrReplace({ ...rest, ...common, _id: `drafts.${id}` })
    return
  }

  await client.createOrReplace({
    _id: `drafts.${id}`,
    _type: 'portfolio',
    title: w.title,
    slug: { _type: 'slug', current: w.slug },
    client: w.client,
    category: 'web-mobile-dev',
    mainImage: image(desktop),
    description: w.description,
    projectUrl: w.url,
    featured: false,
    ...common,
  })
}

// --patch: set the technologies, the work list and the tablet capture on a draft that is already
// there, leaving everything edited in Studio since as it is.
async function patchDraft(w) {
  const id = await targetId(w)
  if (!(await client.getDocument(`drafts.${id}`))) throw new Error('no draft to patch')
  const tablet = await upload(w.key, 'tablet')
  await client
    .patch(`drafts.${id}`)
    .set({ tools: w.tools ?? [], workDone: w.workDone ?? [], ...(tablet ? { 'websiteScreenshots.tablet': image(tablet) } : {}) })
    .commit()
  return Boolean(tablet)
}

async function publishDraft(w) {
  const id = await targetId(w)
  const draft = await client.getDocument(`drafts.${id}`)
  if (!draft) return false
  const { _rev, _updatedAt, ...rest } = draft
  await client.transaction().createOrReplace({ ...rest, _id: id }).delete(`drafts.${id}`).commit()
  return true
}

let done = 0
for (const w of works) {
  try {
    if (publish) {
      if (await publishDraft(w)) done++
      else console.log('no draft:', w.key)
    } else if (patch) {
      const tablet = await patchDraft(w)
      done++
      console.log('patched', w.existing ?? w.slug, tablet ? '' : '(no tablet capture)')
      continue
    } else {
      await writeDraft(w)
      done++
    }
    console.log(publish ? 'published' : 'draft', w.existing ?? w.slug)
  } catch (e) {
    console.error('FAILED', w.key, e.message)
  }
}
console.log(`${done} of ${works.length} ${publish ? 'published' : patch ? 'patched' : 'written as drafts'}`)
