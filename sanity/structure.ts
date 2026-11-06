/**
 * Studio sidebar, grouped the way the site is: Our work by category (ads
 * split per platform), reviews and blog posts per service, then partners
 * and the chat inbox. Every filtered list creates new documents with its
 * category / service already filled in (templates below).
 * @author Paşa Quliyev — Cradex Agency
 */
import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import type { Template } from 'sanity'
import { BookOpen, Briefcase, Globe, Handshake, Inbox, Megaphone, MessageSquareQuote, Search, ShieldCheck, Smartphone, Star, Tag } from 'lucide-react'
import { AD_PLATFORMS, WORK_CATEGORIES } from './schemas/workCase'
import { SERVICE_TAGS } from './schemas/locale'

const CATEGORY_ICONS: Record<string, typeof Megaphone> = { ads: Megaphone, mobile: Smartphone, seo: Search, support: ShieldCheck }

/** New-document presets: one per work category / ad platform / service tag. */
export const templates = (prev: Template[]): Template[] => [
  ...prev,
  ...WORK_CATEGORIES.map((c) => ({
    id: `workCase-${c.value}`,
    title: `İş: ${c.title}`,
    schemaType: 'workCase',
    value: { category: c.value, published: true, order: 0 },
  })),
  ...AD_PLATFORMS.map((p) => ({
    id: `workCase-ads-${p.value}`,
    title: `Reklam: ${p.title.split(' (')[0]}`,
    schemaType: 'workCase',
    value: { category: 'ads', platform: p.value, published: true, order: 0 },
  })),
  ...SERVICE_TAGS.flatMap((s) => [
    { id: `testimonial-${s.value}`, title: `Rəy: ${s.title}`, schemaType: 'testimonial', value: { services: [s.value], rating: 5 } },
    { id: `blog-${s.value}`, title: `Bloq: ${s.title}`, schemaType: 'blog', value: { services: [s.value] } },
  ]),
]

const list = (S: StructureBuilder, title: string, type: string, filter: string, params: Record<string, string>, template: string) =>
  S.documentList()
    .title(title)
    .schemaType(type)
    .filter(filter)
    .params(params)
    .defaultOrdering([{ field: 'order', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }])
    .initialValueTemplates([S.initialValueTemplateItem(template)])

function workItems(S: StructureBuilder) {
  return WORK_CATEGORIES.map((c) => {
    const item = S.listItem().id(`work-${c.value}`).title(c.title).icon(CATEGORY_ICONS[c.value])
    if (c.value !== 'ads') {
      return item.child(list(S, c.title, 'workCase', '_type == "workCase" && category == $c', { c: c.value }, `workCase-${c.value}`))
    }
    return item.child(
      S.list()
        .title(c.title)
        .items([
          S.listItem()
            .id('ads-all')
            .title('Bütün kampaniyalar')
            .child(list(S, 'Bütün kampaniyalar', 'workCase', '_type == "workCase" && category == "ads"', {}, 'workCase-ads')),
          S.divider(),
          ...AD_PLATFORMS.map((p) =>
            S.listItem()
              .id(`ads-${p.value}`)
              .title(p.title.split(' (')[0])
              .child(
                list(S, p.title.split(' (')[0], 'workCase', '_type == "workCase" && category == "ads" && platform == $p', { p: p.value }, `workCase-ads-${p.value}`)
              )
          ),
        ])
    )
  })
}

/** "All", the untagged ones, then one list per service tag. */
function byService(S: StructureBuilder, type: 'testimonial' | 'blog', allTitle: string, extra: ReturnType<StructureBuilder['listItem']>[] = []) {
  return S.list()
    .title(allTitle)
    .items([
      S.listItem().id(`${type}-all`).title('Hamısı').child(S.documentTypeList(type).title(allTitle)),
      ...extra,
      S.listItem()
        .id(`${type}-untagged`)
        .title('Xidmət seçilməyib')
        .child(S.documentList().title('Xidmət seçilməyib').schemaType(type).filter(`_type == "${type}" && count(coalesce(services, [])) == 0`)),
      S.divider(),
      ...SERVICE_TAGS.map((s) =>
        S.listItem()
          .id(`${type}-${s.value}`)
          .title(s.title)
          .icon(Tag)
          .child(
            S.documentList()
              .title(s.title)
              .schemaType(type)
              .filter(`_type == "${type}" && $s in services`)
              .params({ s: s.value })
              .initialValueTemplates([S.initialValueTemplateItem(`${type}-${s.value}`)])
          )
      ),
    ])
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Cradex Agency')
    .items([
      S.listItem()
        .id('work')
        .title('İşlərimiz')
        .icon(Briefcase)
        .child(
          S.list()
            .title('İşlərimiz')
            .items([
              S.listItem().id('work-web').title('Veb saytlar').icon(Globe).child(S.documentTypeList('portfolio').title('Veb saytlar')),
              S.divider(),
              ...workItems(S),
            ])
        ),
      S.listItem()
        .id('reviews')
        .title('Müştəri rəyləri')
        .icon(MessageSquareQuote)
        .child(
          byService(S, 'testimonial', 'Müştəri rəyləri', [
            S.listItem()
              .id('testimonial-home')
              .title('Əsas səhifədə')
              .icon(Star)
              .child(S.documentList().title('Əsas səhifədə').schemaType('testimonial').filter('_type == "testimonial" && featured == true')),
          ])
        ),
      S.listItem().id('blog').title('Bloq yazıları').icon(BookOpen).child(byService(S, 'blog', 'Bloq yazıları')),
      S.divider(),
      S.documentTypeListItem('partner').title('Tərəfdaşlar (loqolar)').icon(Handshake),
      S.listItem()
        .id('chat')
        .title('Çatbot')
        .icon(Inbox)
        .child(
          S.list()
            .title('Çatbot')
            .items([S.documentTypeListItem('chatQuestion').title('Gələn suallar'), S.documentTypeListItem('chatAnswer').title('Hazır cavablar')])
        ),
    ])
