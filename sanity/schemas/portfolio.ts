import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'az', type: 'string', title: 'Azərbaycan' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ru', type: 'string', title: 'Русский' },
        { name: 'tr', type: 'string', title: 'Türkçe' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.az',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'SEO / Rəqəmsal', value: 'digital-marketing' },
          { title: 'Ənənəvi Marketinq', value: 'traditional-marketing' },
          { title: 'SMM', value: 'smm' },
          { title: 'Qrafik Dizayn', value: 'graphic-motion-design' },
          { title: 'Foto / Video', value: 'photo-video' },
          { title: 'Brendinq', value: 'branding' },
          { title: 'Copywriting', value: 'copywriting' },
          { title: 'Vebsayt', value: 'web-mobile-dev' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'az', type: 'text', title: 'Azərbaycan', rows: 4 },
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ru', type: 'text', title: 'Русский', rows: 4 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 4 },
      ],
    }),
    defineField({
      name: 'tools',
      title: 'Tools Used',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'results',
      title: 'Results',
      type: 'object',
      fields: [
        { name: 'az', type: 'text', title: 'Azərbaycan', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ru', type: 'text', title: 'Русский', rows: 3 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 3 },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Müddət (məsələn: 8 ay) - YALNIZ SMM üçün',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'smm',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Layihə URL (Sayta bax linki)',
      type: 'url',
    }),
    defineField({
      name: 'detailedSections',
      title: 'Ətraflı Bölmələr - YALNIZ SMM üçün',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlıq (məsələn: Sosial Media Dizaynları)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'description',
              title: 'Təsvir',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'text', rows: 3 },
                { name: 'en', title: 'EN', type: 'text', rows: 3 },
                { name: 'ru', title: 'RU', type: 'text', rows: 3 },
                { name: 'tr', title: 'TR', type: 'text', rows: 3 },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title.az',
              description: 'description.az',
            },
            prepare({ title, description }) {
              return {
                title: title || 'Başlıq yoxdur',
                subtitle: description ? description.substring(0, 60) + '...' : '',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'servicesList',
      title: 'Xidmətlər Siyahısı - YALNIZ SMM üçün',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Xidmət adı',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'description',
              title: 'Qısa təsvir (accordion açılanda görünəcək)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'text', rows: 2 },
                { name: 'en', title: 'EN', type: 'text', rows: 2 },
                { name: 'ru', title: 'RU', type: 'text', rows: 2 },
                { name: 'tr', title: 'TR', type: 'text', rows: 2 },
              ],
            }),
          ],
          preview: {
            select: { 
              title: 'title.az',
              description: 'description.az'
            },
            prepare({ title, description }) {
              return { 
                title: title || 'Xidmət',
                subtitle: description ? description.substring(0, 50) + '...' : ''
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'statistics',
      title: 'Statistikalar - YALNIZ SMM üçün',
      description: 'Kampaniya nəticələri: Reach, Engagement, CTR və s.',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket (məsələn: Reach artımı)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'value',
              title: 'Dəyər (məsələn: +285%)',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: 'İkon',
              type: 'string',
              options: {
                list: [
                  { title: '📈 Artım', value: 'trending-up' },
                  { title: '👥 İstifadəçilər', value: 'users' },
                  { title: '💬 Engagement', value: 'message-circle' },
                  { title: '🎯 Hədəf', value: 'target' },
                  { title: '👁️ Görünürlük', value: 'eye' },
                  { title: '❤️ Bəğənmə', value: 'heart' },
                  { title: '📊 Statistika', value: 'bar-chart' },
                  { title: '🔗 Klik', value: 'link' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              label: 'label.az',
              value: 'value',
              icon: 'icon',
            },
            prepare({ label, value, icon }) {
              return {
                title: `${value} - ${label || 'Etiket yoxdur'}`,
                subtitle: icon ? `İkon: ${icon}` : 'İkon seçilməyib',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.az',
      client: 'client',
      media: 'mainImage',
    },
    prepare(selection) {
      const { client } = selection
      return { ...selection, subtitle: client && `Client: ${client}` }
    },
  },
})
