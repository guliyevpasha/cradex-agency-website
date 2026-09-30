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
      title: 'Müddət (məsələn: 8 ay)',
      type: 'string',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Layihə URL (Sayta bax linki)',
      type: 'url',
    }),
    defineField({
      name: 'detailedSections',
      title: 'Ətraflı Bölmələr',
      type: 'array',
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
      title: 'Xidmətlər Siyahısı',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'az', title: 'AZ', type: 'string' }),
            defineField({ name: 'en', title: 'EN', type: 'string' }),
            defineField({ name: 'ru', title: 'RU', type: 'string' }),
            defineField({ name: 'tr', title: 'TR', type: 'string' }),
          ],
          preview: {
            select: { title: 'az' },
            prepare({ title }) {
              return { title: title || 'Xidmət' }
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
