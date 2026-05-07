import { defineField, defineType } from 'sanity'

export const articleSchema = defineType({
  name: 'article',
  title: 'Məqalə (Journal)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlıq',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Qısa xülasə',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'body',
      title: 'Məzmun',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt mətn', type: 'string' }),
            defineField({ name: 'caption', title: 'Başlıq', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Kateqoriya',
      type: 'string',
      options: {
        list: [
          { title: 'SEO', value: 'seo' },
          { title: 'SMM', value: 'smm' },
          { title: 'Brendinq', value: 'branding' },
          { title: 'Dizayn', value: 'design' },
          { title: 'Copywriting', value: 'copywriting' },
          { title: 'Veb İnkişaf', value: 'web-dev' },
          { title: 'Marketinq Strategiyası', value: 'marketing-strategy' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Müəllif',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Ad', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'role', title: 'Vəzifə', type: 'string' }),
        defineField({ name: 'avatar', title: 'Şəkil', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Örtük şəkli',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt mətn', type: 'string' }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayım tarixi',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Teqlər',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
    defineField({
      name: 'metaTitle',
      title: 'SEO Başlıq',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Təsvir',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
  ],
  groups: [
    { name: 'seo', title: 'SEO' },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      category: 'category',
    },
    prepare({ title, author, media, category }) {
      return {
        title,
        subtitle: `${category ?? ''} · ${author ?? ''}`,
        media,
      }
    },
  },
})
