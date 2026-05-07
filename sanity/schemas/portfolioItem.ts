import { defineField, defineType } from 'sanity'

export const portfolioItemSchema = defineType({
  name: 'portfolioItem',
  title: 'Portfolio İşi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Layihə adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Müştəri adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceCategory',
      title: 'Xidmət kateqoriyası',
      type: 'string',
      options: {
        list: [
          { title: 'Rəqəmsal Marketinq', value: 'digital-marketing' },
          { title: 'Ənənəvi Marketinq', value: 'traditional-marketing' },
          { title: 'SMM', value: 'smm' },
          { title: 'Qrafik / Motion Dizayn', value: 'graphic-motion-design' },
          { title: 'Foto / Video', value: 'photo-video' },
          { title: 'Brendinq', value: 'branding' },
          { title: 'Copywriting', value: 'copywriting' },
          { title: 'Veb / Mobil', value: 'web-mobile-dev' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Örtük şəkli',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt mətn', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Qalereya şəkilləri',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt mətn', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube/Vimeo embed)',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Layihə təsviri',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'tools',
      title: 'İstifadə olunan alətlər',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'tags',
      title: 'Teqlər',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'results',
      title: 'Nəticələr',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Əsas səhifədə göstər',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tarix',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Dil',
      type: 'string',
      options: {
        list: [
          { title: 'Azərbaycan', value: 'az' },
          { title: 'English', value: 'en' },
          { title: 'Русский', value: 'ru' },
          { title: 'Türkçe', value: 'tr' },
        ],
      },
      initialValue: 'az',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'clientName',
      media: 'coverImage',
      category: 'serviceCategory',
      featured: 'featured',
    },
    prepare({ title, client, media, category, featured }) {
      return {
        title,
        subtitle: `${client ?? ''} · ${category ?? ''}${featured ? ' ⭐' : ''}`,
        media,
      }
    },
  },
})
