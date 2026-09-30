// Service types
export type ServiceSlug =
  | 'digital-marketing'
  | 'traditional-marketing'
  | 'smm'
  | 'graphic-motion-design'
  | 'photo-video'
  | 'branding'
  | 'copywriting'
  | 'web-mobile-dev'

export interface ServiceBenefit {
  icon: string          // Lucide icon name
  title: string         // i18n key
  description: string   // i18n key
}

export interface ProcessStep {
  step: number
  title: string         // i18n key
  description: string   // i18n key
}

export interface PricingSubType {
  id: string
  labelKey: string
  baseMin: number
  baseMax: number
  isMonthly?: boolean
}

export interface PricingAddon {
  id: string
  labelKey: string
  addMin: number
  addMax: number
  isMonthly?: boolean
}

export interface ServicePricing {
  baseMin: number       // AZN (fallback)
  baseMax: number       // AZN (fallback)
  durationMultiplier: Record<string, number>  // '1m': 1, '3m': 2.5, '6m': 4.5
  platformMultiplier?: Record<string, number> // '1': 1, '2': 1.8, '3+': 2.5
  subTypes?: PricingSubType[]
  addons?: PricingAddon[]
  isMonthly?: boolean   // if true, duration multiplier applies
}

export interface Service {
  id: string
  slug: ServiceSlug
  nameKey: string
  descriptionKey: string
  shortDescKey: string
  icon: string
  coverImage: string
  benefits: ServiceBenefit[]
  processSteps: ProcessStep[]
  portfolioIds: string[]
  metaTitleKey: string
  metaDescriptionKey: string
  pricing: ServicePricing
}

// Portfolio types
export interface PortfolioItemTitle {
  az: string
  en: string
  ru: string
  tr: string
}

export interface PortfolioItem {
  id: string
  slug: string
  titleKey: string
  title?: PortfolioItemTitle
  clientName: string
  serviceCategory: ServiceSlug
  tags: string[]
  coverImage: string
  gallery: string[]
  videoUrl?: string
  projectUrl?: string  // External project URL
  descriptionKey: string
  description?: PortfolioItemTitle
  tools: string[]
  resultsKey: string
  results?: PortfolioItemTitle
  publishedAt: string
  duration?: string  // e.g., "3 ay", "2 həftə", "8 ay" etc.
  category?: string  // e.g., "smm", "digital-marketing", etc.
  featured: boolean
  detailedSections?: Array<{
    title: PortfolioItemTitle
    description: PortfolioItemTitle
  }>
  servicesList?: Array<{
    title: PortfolioItemTitle
    description?: PortfolioItemTitle
  }>
  statistics?: Array<{
    label: PortfolioItemTitle
    value: string
    icon?: string
  }>
  mediaGallery?: {
    socialMediaPosts?: Array<{
      url: string
      aspectRatio?: '4:5' | '9:16'
      caption?: PortfolioItemTitle
    }>
    motionDesigns?: Array<{
      url: string
      mimeType?: string
      caption?: PortfolioItemTitle
    }>
    videoContent?: Array<{
      url: string
      mimeType?: string
      caption?: PortfolioItemTitle
    }>
    adResults?: Array<{
      url: string
      caption?: PortfolioItemTitle
    }>
  }
}

// Journal/Blog types
export type ArticleCategory =
  | 'seo'
  | 'smm'
  | 'branding'
  | 'design'
  | 'copywriting'
  | 'web-dev'
  | 'marketing-strategy'

export interface ArticleAuthor {
  id: string
  name: string
  avatarUrl: string
  role: string
}

export interface ArticleJsonLd {
  '@type': 'Article'
  headline: string
  author: { '@type': 'Person'; name: string }
  datePublished: string
  dateModified?: string
  image: string
}

export interface Article {
  id: string
  slug: string
  titleKey: string
  excerptKey: string
  contentKey: string
  category: ArticleCategory
  author: ArticleAuthor
  coverImage: string
  publishedAt: string
  updatedAt?: string
  readingTimeMinutes: number
  tags: string[]
  metaTitleKey: string
  metaDescriptionKey: string
  ogImage: string
  jsonLd: ArticleJsonLd
}

// Calculator types
export interface CalculatorSelection {
  serviceSlug: ServiceSlug
  duration: '1m' | '3m' | '6m' | '12m'
  subType?: string          // e.g. 'landing', 'corporate', 'ecommerce'
  addons?: string[]         // e.g. ['cms', 'multilingual', 'seo']
  platformCount?: 1 | 2 | 3
  volume?: 'basic' | 'standard' | 'premium'
}

export interface PriceRange {
  min: number
  max: number
  currency: 'AZN'
}

export interface CalculatorState {
  selections: CalculatorSelection[]
  totalPrice: PriceRange
  isValid: boolean
  hasDiscount: boolean
}

// Testimonial type
export interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  content: string
  avatarUrl: string
  rating: number
}

// FAQ type
export interface FaqItem {
  id: string
  questionKey: string
  answerKey: string
}
