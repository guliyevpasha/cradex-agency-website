import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials (Müştəri Rəyləri)',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'object',
      description:
        'Names are transliterated per language — Кенан Акберли in Russian, Kenan Akbarli in English.',
      fields: [
        { name: 'az', type: 'string', title: 'Azərbaycan' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ru', type: 'string', title: 'Русский' },
        { name: 'tr', type: 'string', title: 'Türkçe' },
      ],
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
      description: 'Upload a photo here. Leave empty to keep using the path below.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'photoPath',
      title: 'Client Photo — file path',
      type: 'string',
      description:
        'Path to an image already in public/, e.g. /images/testimonials/kenan.jpg. Only used when no photo is uploaded above. Lets the existing photos keep working without re-uploading all of them.',
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
      title: 'clientName.az',
      role: 'clientPosition.az',
      company: 'company',
      media: 'avatar',
      rating: 'rating',
    },
    prepare({ title, role, company, media, rating }) {
      // company is blank on most entries, so lead with the role and only add
      // the company when there is one.
      const subtitle = [role, company].filter(Boolean).join(' · ')
      return {
        title,
        media,
        subtitle: subtitle ? `${subtitle} — ${rating}⭐` : `${rating}⭐`,
      }
    },
  },
})
