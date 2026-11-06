/**
 * Social media combo packages shown on the home and product pages. The order
 * API reads the price from here, never from the browser. Duplicate a package
 * to make a variant; untick "Satışda" to hide one without deleting it.
 * @author Paşa Quliyev — Cradex Agency
 */
import { defineArrayMember, defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export const COMBO_PLATFORM_OPTIONS = [
  { title: 'Instagram', value: 'instagram' },
  { title: 'TikTok', value: 'tiktok' },
  { title: 'YouTube', value: 'youtube' },
  { title: 'Facebook', value: 'facebook' },
  { title: 'Telegram', value: 'telegram' },
]

const money = (name: 'azn' | 'usd', title: string, description: string) =>
  defineField({
    name,
    title,
    description,
    type: 'number',
    validation: (Rule) => Rule.required().positive().max(100000).precision(2),
  })

export default defineType({
  name: 'comboPackage',
  title: 'Kombo paket',
  type: 'document',
  icon: Package,
  fields: [
    defineField({ name: 'title', title: 'Paketin adı', type: 'localeString', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Kod (URL)',
      description: 'Sifarişlərdə paketin kodu. Bir dəfə yaradın, sonra dəyişməyin.',
      type: 'slug',
      options: { source: 'title.az', maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platforma',
      description: 'Kartın ikonu və rəngi, həmçinin sifarişdə hansı hesab formatının istəniləcəyi.',
      type: 'string',
      options: { list: COMBO_PLATFORM_OPTIONS, layout: 'radio', direction: 'horizontal' },
      validation: (Rule) => Rule.required(),
    }),
    money('azn', 'Qiymət (AZN)', 'Azərbaycandan alanlar üçün.'),
    money('usd', 'Qiymət (USD)', 'Xaricdən alanlar üçün.'),
    defineField({
      name: 'features',
      title: 'Paketə daxildir',
      description: 'Hər sətir ayrıca: "1000 İzləyici", "50.000 Baxış" və s.',
      type: 'array',
      of: [defineArrayMember({ type: 'localeString' })],
      validation: (Rule) => Rule.min(1).max(16),
    }),
    defineField({ name: 'active', title: 'Satışda', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', title: 'Sıra', description: 'Kiçik rəqəm əvvəl göstərilir.', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Sıra', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.az', platform: 'platform', azn: 'azn', usd: 'usd', active: 'active' },
    prepare({ title, platform, azn, usd, active }) {
      const name = COMBO_PLATFORM_OPTIONS.find((p) => p.value === platform)?.title ?? ''
      return { title: title || 'Adsız paket', subtitle: [active === false ? 'Satışda deyil' : null, name, azn ? `${azn} ₼` : null, usd ? `$${usd}` : null].filter(Boolean).join(' · ') }
    },
  },
})
