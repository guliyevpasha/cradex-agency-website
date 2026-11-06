import { createElement } from 'react'
import { defineField, defineType } from 'sanity'
import { SERVICE_TAGS } from './locale'

// Where photoPath entries are served from. Studio can only render assets it
// stores itself, so a path like /images/testimonials/kenan.jpg needs an absolute
// URL before it can be shown as a thumbnail.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cradexagency.com'

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
      name: 'services',
      title: 'Harada görünsün',
      description:
        '"Əsas səhifə" və müştərinin istifadə etdiyi xidmət / məhsul. Rəy yalnız seçilən səhifələrdə görünür. Heç bir rəydə "Əsas səhifə" seçilməsə, əsas səhifədə bütün rəylər görünür.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [{ title: 'Əsas səhifə', value: 'home' }, ...SERVICE_TAGS], layout: 'grid' },
      validation: (Rule) =>
        Rule.custom((v) =>
          Array.isArray(v) && v.some((x) => x !== 'home') ? true : 'Xidmət seçilməyib: rəy heç bir xidmət səhifəsində görünməyəcək.'
        ).warning(),
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
      title: 'Featured (köhnə)',
      type: 'boolean',
      // replaced by the "Əsas səhifə" option above; kept so old data stays intact
      hidden: true,
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
      photoPath: 'photoPath',
      rating: 'rating',
      services: 'services',
    },
    prepare({ title, role, company, media, photoPath, rating, services }) {
      // company is blank on most entries, so lead with the role and only add
      // the company when there is one.
      const subtitle = [role, company].filter(Boolean).join(' · ')
      return {
        title,
        // Without this the migrated entries show a blank document icon: their
        // photo lives in the site's public/ folder, not in Sanity, so there is
        // no asset for Studio to render. Fall back to fetching it over HTTP.
        media:
          media ||
          (photoPath
            ? createElement('img', {
                src: `${SITE_URL}${photoPath}`,
                alt: '',
                style: { width: '100%', height: '100%', objectFit: 'cover' },
              })
            : undefined),
        // the service tags first, so untagged reviews stand out in the list
        subtitle: [
          (services as string[] | undefined)?.map((v) => (v === 'home' ? 'Əsas səhifə' : SERVICE_TAGS.find((t) => t.value === v)?.title ?? v)).join(', ') || 'Xidmət seçilməyib',
          subtitle,
          `${rating}⭐`,
        ]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
