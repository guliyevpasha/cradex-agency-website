import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partners (Tərəfdaşlar)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this partner on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      active: 'active',
    },
    prepare(selection) {
      const { active } = selection
      return {
        ...selection,
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
