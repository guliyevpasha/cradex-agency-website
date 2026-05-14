import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials (Müştəri Rəyləri)',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientPosition',
      title: 'Client Position',
      type: 'object',
      fields: [
        { name: 'az', type: 'string', title: 'Azərbaycan' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ru', type: 'string', title: 'Русский' },
        { name: 'tr', type: 'string', title: 'Türkçe' },
      ],
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'avatar',
      title: 'Client Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        { name: 'az', type: 'text', title: 'Azərbaycan', rows: 4 },
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ru', type: 'text', title: 'Русский', rows: 4 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 4 },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'clientName',
      company: 'company',
      media: 'avatar',
      rating: 'rating',
    },
    prepare(selection) {
      const { company, rating } = selection
      return {
        ...selection,
        subtitle: `${company} - ${rating}⭐`,
      }
    },
  },
})
