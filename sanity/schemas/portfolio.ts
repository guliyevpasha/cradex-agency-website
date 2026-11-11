import { defineField, defineType } from 'sanity'
import { WEB_FIELDS } from '../../lib/site/webCategories'
import { WORK_ITEMS } from '../../lib/site/webWork'

export default defineType({
  name: 'portfolio',
  title: 'Veb sayt işləri',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlıq',
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
      title: 'Link (slug)',
      type: 'slug',
      options: {
        source: 'title.az',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Müştəri',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Kateqoriya',
      type: 'string',
      initialValue: 'web-mobile-dev',
      // older entries keep their old value (smm …); those are archived and not shown
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Sahə (saytdakı filtr)',
      description: 'İşlərimiz səhifəsində layihə bu sahənin altında göstərilir.',
      type: 'string',
      options: { list: WEB_FIELDS.map((f) => ({ title: f.title, value: f.value })) },
      hidden: ({ document }) => document?.category !== 'web-mobile-dev',
    }),
    defineField({
      name: 'mainImage',
      title: 'Əsas şəkil (Cover)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'websiteScreenshots',
      title: 'Veb sayt görüntüləri (Desktop & Mobile)',
      description: 'Saytın masaüstü və mobil versiyalarının ekran görüntüləri - canlı saytda mockup dizaynında göstəriləcək',
      type: 'object',
      hidden: ({ document }) => document?.category !== 'web-mobile-dev',
      fields: [
        {
          name: 'desktop',
          title: '🖥️ Desktop Screenshot (1920x1080 və ya daha böyük)',
          type: 'image',
          description: 'Tam ekran desktop görüntüsü - yüksək keyfiyyətli PNG/WebP',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'tablet',
          title: '📱 Tablet Screenshot (820x1093 və ya planşet ölçüsü)',
          type: 'image',
          description: 'Planşet görüntüsü - şaquli format. Boş qalsa, layihə səhifəsində planşet göstərilmir',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'mobile',
          title: '📱 Mobile Screenshot (375x812 və ya mobil ölçü)',
          type: 'image',
          description: 'Mobil versiya görüntüsü - şaquli format',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Qalereya (Əlavə şəkillər)',
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
      title: 'Təsvir',
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
      title: 'İstifadə olunan texnologiyalar',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'workDone',
      title: 'Layihədə görülən işlər',
      description: 'Layihə səhifəsində texnologiyalarla birlikdə göstərilir.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: WORK_ITEMS.map((w) => ({ title: w.title, value: w.value })), layout: 'grid' },
      hidden: ({ document }) => document?.category !== 'web-mobile-dev',
    }),
    defineField({
      name: 'results',
      title: 'Nəticələr',
      type: 'object',
      fields: [
        { name: 'az', type: 'text', title: 'Azərbaycan', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ru', type: 'text', title: 'Русский', rows: 3 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 3 },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Müddət (məsələn: 8 ay) - YALNIZ SMM üçün',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'smm',
    }),
    defineField({
      name: 'projectUrl',
      title: 'Layihə URL (Sayta bax linki)',
      type: 'url',
    }),
    defineField({
      name: 'detailedSections',
      title: 'Ətraflı Bölmələr - YALNIZ SMM üçün',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Başlıq (məsələn: Sosial Media Dizaynları)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'description',
              title: 'Təsvir',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'text', rows: 3 },
                { name: 'en', title: 'EN', type: 'text', rows: 3 },
                { name: 'ru', title: 'RU', type: 'text', rows: 3 },
                { name: 'tr', title: 'TR', type: 'text', rows: 3 },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title.az',
              description: 'description.az',
            },
            prepare({ title, description }) {
              return {
                title: title || 'Başlıq yoxdur',
                subtitle: description ? description.substring(0, 60) + '...' : '',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'servicesList',
      title: 'Xidmətlər Siyahısı - YALNIZ SMM üçün',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Xidmət adı',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'description',
              title: 'Qısa təsvir (accordion açılanda görünəcək)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'text', rows: 2 },
                { name: 'en', title: 'EN', type: 'text', rows: 2 },
                { name: 'ru', title: 'RU', type: 'text', rows: 2 },
                { name: 'tr', title: 'TR', type: 'text', rows: 2 },
              ],
            }),
          ],
          preview: {
            select: { 
              title: 'title.az',
              description: 'description.az'
            },
            prepare({ title, description }) {
              return { 
                title: title || 'Xidmət',
                subtitle: description ? description.substring(0, 50) + '...' : ''
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mediaGallery',
      title: 'Media Qalereya - YALNIZ SMM üçün',
      description: 'Post dizaynları, motion dizaynlar, reels və reklam nəticələri',
      type: 'object',
      hidden: ({ document }) => document?.category !== 'smm',
      fields: [
        defineField({
          name: 'socialMediaPosts',
          title: 'Sosial Media Postları (Şəkillər)',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'aspectRatio',
                  title: 'Ölçü / Format',
                  type: 'string',
                  options: {
                    list: [
                      { title: '1080x1350 (4:5 - Feed Post)', value: '4:5' },
                      { title: '1080x1920 (9:16 - Story/Reels)', value: '9:16' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: '4:5',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'caption',
                  title: 'Başlıq (opsional)',
                  type: 'object',
                  fields: [
                    { name: 'az', title: 'AZ', type: 'string' },
                    { name: 'en', title: 'EN', type: 'string' },
                    { name: 'ru', title: 'RU', type: 'string' },
                    { name: 'tr', title: 'TR', type: 'string' },
                  ],
                },
              ],
            },
          ],
        }),
        defineField({
          name: 'motionDesigns',
          title: 'Motion Dizaynlar (Video/GIF)',
          type: 'array',
          of: [
            {
              type: 'file',
              options: {
                accept: 'video/*,.gif',
              },
              fields: [
                {
                  name: 'aspectRatio',
                  title: 'Ölçü / Format',
                  type: 'string',
                  options: {
                    list: [
                      { title: '1080x1350 (4:5 - Feed Post)', value: '4:5' },
                      { title: '1080x1920 (9:16 - Story/Reels)', value: '9:16' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: '9:16',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'caption',
                  title: 'Başlıq (opsional)',
                  type: 'object',
                  fields: [
                    { name: 'az', title: 'AZ', type: 'string' },
                    { name: 'en', title: 'EN', type: 'string' },
                    { name: 'ru', title: 'RU', type: 'string' },
                    { name: 'tr', title: 'TR', type: 'string' },
                  ],
                },
              ],
            },
          ],
        }),
        defineField({
          name: 'videoContent',
          title: 'Video Kontent (Reels)',
          type: 'array',
          of: [
            {
              type: 'file',
              options: {
                accept: 'video/*',
              },
              fields: [
                {
                  name: 'aspectRatio',
                  title: 'Ölçü / Format',
                  type: 'string',
                  options: {
                    list: [
                      { title: '1080x1350 (4:5 - Feed Post)', value: '4:5' },
                      { title: '1080x1920 (9:16 - Story/Reels)', value: '9:16' },
                    ],
                    layout: 'radio',
                  },
                  initialValue: '9:16',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'caption',
                  title: 'Başlıq (opsional)',
                  type: 'object',
                  fields: [
                    { name: 'az', title: 'AZ', type: 'string' },
                    { name: 'en', title: 'EN', type: 'string' },
                    { name: 'ru', title: 'RU', type: 'string' },
                    { name: 'tr', title: 'TR', type: 'string' },
                  ],
                },
              ],
            },
          ],
        }),
        defineField({
          name: 'adResults',
          title: 'Meta Reklam Nəticələri (Ekran görüntüləri)',
          type: 'array',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'caption',
                  title: 'Başlıq (opsional)',
                  type: 'object',
                  fields: [
                    { name: 'az', title: 'AZ', type: 'string' },
                    { name: 'en', title: 'EN', type: 'string' },
                    { name: 'ru', title: 'RU', type: 'string' },
                    { name: 'tr', title: 'TR', type: 'string' },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'statistics',
      title: 'Statistikalar - YALNIZ SMM üçün',
      description: 'Kampaniya nəticələri: Reach, Engagement, CTR və s.',
      type: 'array',
      hidden: ({ document }) => document?.category !== 'smm',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Etiket (məsələn: Reach artımı)',
              type: 'object',
              fields: [
                { name: 'az', title: 'AZ', type: 'string' },
                { name: 'en', title: 'EN', type: 'string' },
                { name: 'ru', title: 'RU', type: 'string' },
                { name: 'tr', title: 'TR', type: 'string' },
              ],
            }),
            defineField({
              name: 'value',
              title: 'Dəyər (məsələn: +285%)',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: 'İkon',
              type: 'string',
              options: {
                list: [
                  { title: '📈 Artım / Trend', value: 'trending-up' },
                  { title: '👥 İstifadəçilər / Auditoriya', value: 'users' },
                  { title: '💬 Engagement / Qarşılıqlı əlaqə', value: 'message-circle' },
                  { title: '🎯 Hədəf / Targeting', value: 'target' },
                  { title: '👁️ Görünürlük / İmpression', value: 'eye' },
                  { title: '❤️ Bəğənmə / Like', value: 'heart' },
                  { title: '📊 Statistika / Analytics', value: 'bar-chart' },
                  { title: '🔗 Klik / Link', value: 'link' },
                  { title: '💰 Satış / Sales', value: 'dollar-sign' },
                  { title: '📈💰 ROAS / Return on Ad Spend', value: 'trending-up-dollar' },
                  { title: '🛒 E-commerce / Alış-veriş', value: 'shopping-cart' },
                  { title: '📞 Lead / Müraciət', value: 'phone' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              label: 'label.az',
              value: 'value',
              icon: 'icon',
            },
            prepare({ label, value, icon }) {
              return {
                title: `${value} - ${label || 'Etiket yoxdur'}`,
                subtitle: icon ? `İkon: ${icon}` : 'İkon seçilməyib',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'completedAt',
      title: 'Tamamlanma tarixi',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Seçilmiş layihə',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title.az',
      client: 'client',
      industry: 'industry',
      media: 'mainImage',
    },
    prepare({ title, client, industry, media }) {
      const field = WEB_FIELDS.find((f) => f.value === industry)?.title
      return { title, media, subtitle: [field, client].filter(Boolean).join(' · ') }
    },
  },
})
