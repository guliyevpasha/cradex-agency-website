import { createElement } from 'react'
import { defineField, defineType } from 'sanity'

import { urlForImage } from '../lib/image'

export default defineType({
  name: 'partner',
  title: 'Tərəfdaş',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ad',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Loqo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Sayt',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Saytda göstər',
      type: 'boolean',
      description: 'Show this partner on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      // select takes plain paths only — a GROQ dereference like
      // logo.asset->url silently resolves to undefined here, so take the image
      // object and build the URL below.
      logo: 'logo',
      active: 'active',
      order: 'order',
    },
    prepare({ title, logo, active, order }) {
      const logoUrl = logo?.asset ? urlForImage(logo).url() : null
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
          : // Fall back to the raw image object, which Studio renders itself.
            logo,
      }
    },
  },
})
