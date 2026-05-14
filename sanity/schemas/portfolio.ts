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
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
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
