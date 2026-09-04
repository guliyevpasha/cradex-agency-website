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

// Sanity now returns every locale, so entries pass straight through. The old
// mapping copied one language into all four slots, which silently replaced the
// Russian and English versions with the Azerbaijani text.
export async function getAllTestimonials(): Promise<Testimonial[]> {
  if (USE_SANITY) {
    try {
      const fromSanity = await getSanityTestimonials()
      // An empty CMS should not blank the section out.
      if (fromSanity.length > 0) return fromSanity
    } catch (error) {
      console.error('Failed to fetch testimonials from Sanity, using fallback data:', error)
    }
  }
  return staticTestimonials
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  if (USE_SANITY) {
    try {
      const fromSanity = await getSanityFeaturedTestimonials()
      if (fromSanity.length > 0) return fromSanity
    } catch (error) {
      console.error('Failed to fetch featured testimonials from Sanity, using fallback data:', error)
    }
  }
  return staticTestimonials.filter((t: any) => t.featured)
}

// For backward compatibility
export const testimonials: Testimonial[] = staticTestimonials
