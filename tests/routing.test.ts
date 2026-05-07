import { describe, it, expect } from 'vitest'
import { getAllServicesSync } from '@/lib/data/services'
import { getAllPortfolioSync } from '@/lib/data/portfolio'
import { getAllArticlesSync } from '@/lib/data/journal'

const locales = ['az', 'en', 'ru', 'tr']

describe('Routing — correctness properties', () => {
  // Property 1: All service slugs are unique
  it('service slugs are unique', () => {
    const services = getAllServicesSync()
    const slugs = services.map((s) => s.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).toBe(uniqueSlugs.size)
  })

  // Property 2: Exactly 8 services
  it('there are exactly 8 services', () => {
    const services = getAllServicesSync()
    expect(services.length).toBe(8)
  })

  // Property 3: 32 static service pages (4 locales × 8 services)
  it('generates 32 static service pages', () => {
    const services = getAllServicesSync()
    const params = locales.flatMap((locale) =>
      services.map((service) => ({ locale, slug: service.slug }))
    )
    expect(params.length).toBe(32)
  })

  // Property 4: All portfolio slugs are unique
  it('portfolio slugs are unique', () => {
    const items = getAllPortfolioSync()
    const slugs = items.map((i) => i.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).toBe(uniqueSlugs.size)
  })

  // Property 5: All article slugs are unique
  it('article slugs are unique', () => {
    const articles = getAllArticlesSync()
    const slugs = articles.map((a) => a.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).toBe(uniqueSlugs.size)
  })

  // Property 6: All service slugs match the ServiceSlug type
  it('all service slugs are valid ServiceSlug values', () => {
    const validSlugs = [
      'digital-marketing', 'traditional-marketing', 'smm',
      'graphic-motion-design', 'photo-video', 'branding',
      'copywriting', 'web-mobile-dev',
    ]
    const services = getAllServicesSync()
    for (const service of services) {
      expect(validSlugs).toContain(service.slug)
    }
  })

  // Property 7: All services have required pricing fields
  it('all services have valid pricing data', () => {
    const services = getAllServicesSync()
    for (const service of services) {
      expect(service.pricing.baseMin).toBeGreaterThan(0)
      expect(service.pricing.baseMax).toBeGreaterThanOrEqual(service.pricing.baseMin)
      expect(service.pricing.durationMultiplier['1m']).toBe(1)
      expect(service.pricing.durationMultiplier['3m']).toBeGreaterThan(1)
    }
  })

  // Property 8: Portfolio items have valid service categories
  it('all portfolio items have valid service categories', () => {
    const validCategories = [
      'digital-marketing', 'traditional-marketing', 'smm',
      'graphic-motion-design', 'photo-video', 'branding',
      'copywriting', 'web-mobile-dev',
    ]
    const items = getAllPortfolioSync()
    for (const item of items) {
      expect(validCategories).toContain(item.serviceCategory)
    }
  })
})
