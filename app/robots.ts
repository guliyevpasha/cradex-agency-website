import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /studio is the Sanity CMS login. Sanity gates it on project
        // membership, so this is about keeping the editor out of search
        // results for the brand, not about access control.
        disallow: ['/api/', '/_next/', '/studio'],
      },
    ],
    sitemap: 'https://cradexagency.com/sitemap.xml',
  }
}
