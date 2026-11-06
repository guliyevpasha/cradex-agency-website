/**
 * "İşlərimiz" entries beyond websites: ad campaigns, mobile apps, SEO / GEO
 * and technical service. Fields show up only for the category that uses
 * them, so filling one in stays short. Websites keep the `portfolio` type.
 * As soon as a category has one published entry here, its page shows these
 * instead of the built-in samples.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineArrayMember, defineField, defineType, type ConditionalPropertyCallbackContext } from 'sanity'
import { BarChart3 } from 'lucide-react'

export const WORK_CATEGORIES = [
  { title: 'Rəqəmsal reklam', value: 'ads' },
  { title: 'Mobil tətbiq', value: 'mobile' },
  { title: 'SEO və GEO', value: 'seo' },
  { title: 'Texniki xidmət', value: 'support' },
]

export const AD_PLATFORMS = [
  { title: 'Meta Ads (Instagram, Facebook)', value: 'meta' },
  { title: 'TikTok Ads', value: 'tiktok' },
  { title: 'Google Ads', value: 'google' },
  { title: 'LinkedIn Ads', value: 'linkedin' },
]

type Doc = { category?: string }
const cat = ({ document }: ConditionalPropertyCallbackContext) => String(document?.category ?? '')
// only(...): field shown just for these categories; except(...): hidden for them.
const only = (...cats: string[]) => (ctx: ConditionalPropertyCallbackContext) => !cats.includes(cat(ctx))
const except = (...cats: string[]) => (ctx: ConditionalPropertyCallbackContext) => cats.includes(cat(ctx))

export default defineType({
  name: 'workCase',
  title: 'İşlərimiz — kampaniya və layihələr',
  type: 'document',
  icon: BarChart3,
  groups: [
    { name: 'main', title: 'Əsas', default: true },
    { name: 'numbers', title: 'Rəqəmlər' },
    { name: 'settings', title: 'Ayarlar' },
  ],
  fields: [
    defineField({
      name: 'category',
      title: 'Kateqoriya',
      type: 'string',
      group: 'main',
      options: { list: WORK_CATEGORIES, layout: 'radio', direction: 'horizontal' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Reklam platforması',
      type: 'string',
      group: 'main',
      options: { list: AD_PLATFORMS, layout: 'radio' },
      hidden: only('ads'),
      validation: (Rule) =>
        Rule.custom((v, ctx) => ((ctx.document as Doc)?.category === 'ads' && !v ? 'Reklam üçün platforma seçin' : true)),
    }),
    defineField({
      name: 'group',
      title: 'Bölmə',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Veb sayt', value: 'web' },
          { title: 'Sosial media hesabları', value: 'social' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: only('support'),
    }),
    defineField({
      name: 'kind',
      title: 'Ekran görünüşü (telefon maketi)',
      description: 'Kartdakı telefonda hansı ekran çəkilsin.',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Çatdırılma (xəritə)', value: 'delivery' },
          { title: 'Randevu (təqvim)', value: 'booking' },
          { title: 'Onlayn mağaza (kataloq)', value: 'shop' },
          { title: 'Fitness / statistika', value: 'fitness' },
        ],
      },
      hidden: only('mobile'),
    }),
    defineField({
      name: 'title',
      title: 'Başlıq',
      description: 'Mobil tətbiq və texniki xidmət kartlarının başlığı (məs. "Randevu tətbiqi").',
      type: 'localeString',
      group: 'main',
      hidden: only('mobile', 'support'),
    }),
    defineField({
      name: 'sector',
      title: 'Sahə / müştəri növü',
      description: 'Məs. "Estetik klinika", "Onlayn mağaza". Müştərinin adını yazmaq istəmirsinizsə, sahəni yazın.',
      type: 'localeString',
      group: 'main',
      hidden: except('support'),
    }),
    defineField({
      name: 'goal',
      title: 'Kampaniya növü / strategiya',
      description: 'Məs. "Lead formu", "Performance Max", "Lokal SEO".',
      type: 'localeString',
      group: 'main',
      hidden: except('mobile', 'support'),
    }),
    defineField({
      name: 'period',
      title: 'Müddət',
      description: 'Məs. "30 gün", "6 ay".',
      type: 'localeString',
      group: 'main',
      hidden: except('mobile', 'support'),
    }),
    defineField({
      name: 'text',
      title: 'Qısa təsvir',
      description: 'Bir-iki cümlə: nə etdik.',
      type: 'localeText',
      group: 'main',
      hidden: except('support'),
    }),
    defineField({ name: 'problem', title: 'Problem', type: 'localeText', group: 'main', hidden: only('support') }),
    defineField({ name: 'solution', title: 'Nə etdik', type: 'localeText', group: 'main', hidden: only('support') }),
    defineField({ name: 'result', title: 'Nəticə', description: 'Qısa: "Hesab 5 gündə açıldı".', type: 'localeString', group: 'main', hidden: only('support') }),
    defineField({
      name: 'features',
      title: 'Funksiyalar (teqlər)',
      description: 'Məs. "Push bildiriş", "Onlayn ödəniş". Hər biri ayrıca.',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({ type: 'localeString' })],
      validation: (Rule) => Rule.max(6),
      hidden: only('mobile'),
    }),
    defineField({
      name: 'metrics',
      title: 'Göstəricilər',
      description: 'Ən çox 3. Sonuncu kartda vurğulanır (məs. "Bir müraciət — $0.60").',
      type: 'array',
      group: 'numbers',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metric',
          fields: [
            defineField({ name: 'label', title: 'Ad', type: 'localeString' }),
            defineField({ name: 'value', title: 'Dəyər', description: 'Məs. "$600", "1 000", "+184%".', type: 'string', validation: (Rule) => Rule.required().max(16) }),
          ],
          preview: { select: { title: 'label.az', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.max(3),
      hidden: except('mobile', 'support'),
    }),
    defineField({
      name: 'chart',
      title: 'Qrafik',
      description: 'Reklam: 7 həftəlik dəyər, SEO: 6 aylıq dəyər. 0–100 arası, ən yüksəyi 100. Boş qalsa qrafik yumşaq artım kimi çəkilir.',
      type: 'array',
      group: 'numbers',
      of: [defineArrayMember({ type: 'number', validation: (Rule) => Rule.min(0).max(100) })],
      validation: (Rule) => Rule.max(12),
      hidden: except('mobile', 'support'),
    }),
    defineField({
      name: 'client',
      title: 'Müştəri (daxili qeyd)',
      description: 'Saytda göstərilmir. Kimin işi olduğunu yadda saxlamaq üçün.',
      type: 'string',
      group: 'settings',
    }),
    defineField({
      name: 'published',
      title: 'Saytda göstər',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      description: 'Kiçik rəqəm əvvəl göstərilir.',
      type: 'number',
      group: 'settings',
      initialValue: 0,
    }),
  ],
  orderings: [{ title: 'Sıra', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { category: 'category', platform: 'platform', sector: 'sector.az', title: 'title.az', goal: 'goal.az', published: 'published' },
    prepare({ category, platform, sector, title, goal, published }) {
      const cat = WORK_CATEGORIES.find((c) => c.value === category)?.title ?? ''
      const plat = AD_PLATFORMS.find((p) => p.value === platform)?.title.split(' (')[0]
      return {
        title: title || sector || 'Adsız iş',
        subtitle: [published === false ? 'Gizli' : null, plat || cat, goal].filter(Boolean).join(' · '),
      }
    },
  },
})
