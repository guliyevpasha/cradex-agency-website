import testimonialsData from './testimonials.data.json'

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

export const testimonials: Testimonial[] = testimonialsData as Testimonial[]
