import { createElement } from 'react'
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
      logoUrl: 'logo.asset->url',
      active: 'active',
      order: 'order',
    },
    prepare({ title, logoUrl, active, order }) {
      return {
        title,
        subtitle: `${active ? 'Active' : 'Inactive'} · order ${order ?? 0}`,
        // Partner logos are solid white, drawn for the site's dark background,
        // so in the Studio's light theme they look like empty boxes. Put them on
        // a dark tile here so the list is actually readable.
        media: logoUrl
          ? createElement(
              'div',
              {
                style: {
                  width: '100%',
                  height: '100%',
                  background: '#0A0A0F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                },
              },
              createElement('img', {
                src: logoUrl,
                alt: '',
                style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
              })
            )
          : undefined,
      }
    },
  },
})
