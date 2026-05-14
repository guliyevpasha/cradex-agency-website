import testimonialsData from './testimonials.data.json'
import { getAllTestimonials as getSanityTestimonials, getFeaturedTestimonials as getSanityFeaturedTestimonials } from '@/sanity/lib/queries'

export interface Testimonial {
  id: string
  name: {
    az: string
    en: string
    ru: string
    tr: string
  }
  role: {
    az: string
    en: string
    ru: string
    tr: string
  }
  company: string
  photo: string
  rating: number
  text: {
    az: string
    en: string
    ru: string
    tr: string
  }
}

// Static fallback data
const staticTestimonials: Testimonial[] = testimonialsData as Testimonial[]

// Check if we should use Sanity (production) or static data (fallback)
const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'

export async function getAllTestimonials(locale: string = 'az'): Promise<Testimonial[]> {
  if (USE_SANITY) {
    try {
      const sanityTestimonials = await getSanityTestimonials(locale)
      // Convert Sanity testimonials to Testimonial format
      return sanityTestimonials.map((t: any) => ({
        id: t.id,
        name: { az: t.name, en: t.name, ru: t.name, tr: t.name },
        role: { az: t.role, en: t.role, ru: t.role, tr: t.role },
        company: t.company,
        photo: t.photo,
        rating: t.rating,
        text: { az: t.text, en: t.text, ru: t.text, tr: t.text },
      }))
    } catch (error) {
      console.error('Failed to fetch testimonials from Sanity, using fallback data:', error)
    }
  }
  return staticTestimonials
}

export async function getFeaturedTestimonials(locale: string = 'az'): Promise<Testimonial[]> {
  if (USE_SANITY) {
    try {
      const sanityTestimonials = await getSanityFeaturedTestimonials(locale)
      return sanityTestimonials.map((t: any) => ({
        id: t.id,
        name: { az: t.name, en: t.name, ru: t.name, tr: t.name },
        role: { az: t.role, en: t.role, ru: t.role, tr: t.role },
        company: t.company,
        photo: t.photo,
        rating: t.rating,
        text: { az: t.text, en: t.text, ru: t.text, tr: t.text },
      }))
    } catch (error) {
      console.error('Failed to fetch featured testimonials from Sanity, using fallback data:', error)
    }
  }
  return staticTestimonials.filter((t: any) => t.featured)
}

// For backward compatibility
export const testimonials: Testimonial[] = staticTestimonials
