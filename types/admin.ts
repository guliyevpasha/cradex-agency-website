// Admin Panel Content Types

export interface MultiLangText {
  az: string
  en: string
  ru: string
  tr: string
}

export interface Article {
  id: string
  slug: string
  title: MultiLangText
  excerpt: MultiLangText
  content: MultiLangText
  category: 'seo' | 'smm' | 'branding' | 'design' | 'copywriting' | 'web-dev' | 'marketing-strategy'
  author: string
  image: string
  publishedAt: string
  readingTime: number
}

export interface PortfolioItem {
  id: string
  slug: string
  title: MultiLangText
  client: string
  serviceCategory: string
  description: MultiLangText
  image: string
  gallery: string[]
  tools: string[]
  results: MultiLangText
  projectUrl?: string
  completedAt: string
  featured: boolean
}

export interface Partner {
  id: string
  name: string
  logo: string
  website?: string
  order: number
}

export interface Testimonial {
  id: string
  clientName: string
  clientPosition: MultiLangText
  company: string
  avatar: string
  rating: 1 | 2 | 3 | 4 | 5
  testimonial: MultiLangText
  featured: boolean
  order: number
}

export interface ArticlesData {
  articles: Article[]
}

export interface PortfolioData {
  portfolio: PortfolioItem[]
}

export interface PartnersData {
  partners: Partner[]
}

export interface TestimonialsData {
  testimonials: Testimonial[]
}
