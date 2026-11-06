/**
 * Four-language field types, so new documents don't repeat the az/en/ru/tr
 * block on every field. Azerbaijani is required; the site falls back to it
 * when a translation is left empty.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineField, defineType } from 'sanity'
import { SERVICE_TAGS as SERVICE_TAG_IDS, type ServiceTag } from '../../lib/site/proof'

const LANGS = [
  { name: 'az', title: 'Azərbaycan' },
  { name: 'en', title: 'English' },
  { name: 'ru', title: 'Русский' },
  { name: 'tr', title: 'Türkçe' },
]

export const localeString = defineType({
  name: 'localeString',
  title: 'Mətn (4 dil)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: LANGS.map((l) =>
    defineField({ name: l.name, title: l.title, type: 'string', validation: l.name === 'az' ? (Rule) => Rule.required() : undefined })
  ),
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Uzun mətn (4 dil)',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: LANGS.map((l) =>
    defineField({ name: l.name, title: l.title, type: 'text', rows: 3, validation: l.name === 'az' ? (Rule) => Rule.required() : undefined })
  ),
})

/** Studio labels for the service tags; the ids live in lib/site/proof so the site and Studio can't drift. */
const SERVICE_TITLES: Record<ServiceTag, string> = {
  web: 'Veb sayt',
  mobile: 'Mobil tətbiq',
  seo: 'SEO və GEO',
  ads: 'Rəqəmsal reklam',
  support: 'Texniki xidmət',
  chatbot: 'Çatbot',
  combo: 'Sosial media kombo paketləri',
}

export const SERVICE_TAGS = SERVICE_TAG_IDS.map((value) => ({ title: SERVICE_TITLES[value], value }))
