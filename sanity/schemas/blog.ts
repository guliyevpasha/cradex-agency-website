import { defineField, defineType } from 'sanity'

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
      title: 'Category',
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
