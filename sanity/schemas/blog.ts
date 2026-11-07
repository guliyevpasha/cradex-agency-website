import { defineField, defineType } from 'sanity'
import { SERVICE_TAGS } from './locale'

export default defineType({
  name: 'blog',
  title: 'Blog Posts (Jurnal)',
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
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Kateqoriya',
      description: 'Bloq səhifəsində yazı bu kateqoriyanın filtrində görünür.',
      type: 'string',
      options: {
        list: [
          { title: 'Veb sayt', value: 'web-dev' },
          { title: 'Mobil tətbiq', value: 'mobile' },
          { title: 'SEO və GEO', value: 'seo' },
          { title: 'Rəqəmsal reklam', value: 'ads' },
          { title: 'Texniki xidmət', value: 'support' },
          { title: 'AI və çatbot', value: 'ai' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Xidmətlər',
      description: 'Yazı hansı xidmət və qiymət səhifələrinin bloq bölməsində görünsün.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: SERVICE_TAGS, layout: 'grid' },
    }),
    defineField({
      name: 'featured',
      title: 'Əsas səhifədə göstər',
      description: 'Seçilən yazılar əsas səhifənin bloq bölməsində birinci çıxır.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'az', type: 'text', title: 'Azərbaycan', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ru', type: 'text', title: 'Русский', rows: 3 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 3 },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        {
          name: 'az',
          type: 'array',
          title: 'Azərbaycan',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
        {
          name: 'ru',
          type: 'array',
          title: 'Русский',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
        {
          name: 'tr',
          type: 'array',
          title: 'Türkçe',
          of: [
            {
              type: 'block',
            },
            {
              type: 'image',
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title.az',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
