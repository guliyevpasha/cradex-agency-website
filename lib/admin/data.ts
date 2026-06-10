import fs from 'fs'
import path from 'path'
import { ArticlesData, PortfolioData, PartnersData, TestimonialsData } from '@/types/admin'

const DATA_DIR = path.join(process.cwd(), 'public', 'data')

/**
 * Read and parse a JSON file from the data directory
 */
function readJSONFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename)
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent) as T
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    // Return empty structure if file doesn't exist or is invalid
    return {} as T
  }
}

/**
 * Get count of articles
 */
export function getArticlesCount(): number {
  const data = readJSONFile<ArticlesData>('articles.json')
  return data.articles?.length || 0
}

/**
 * Get count of portfolio items
 */
export function getPortfolioCount(): number {
  const data = readJSONFile<PortfolioData>('portfolio.json')
  return data.portfolio?.length || 0
}

/**
 * Get count of partners
 */
export function getPartnersCount(): number {
  const data = readJSONFile<PartnersData>('partners.json')
  return data.partners?.length || 0
}

/**
 * Get count of testimonials
 */
export function getTestimonialsCount(): number {
  const data = readJSONFile<TestimonialsData>('testimonials.json')
  return data.testimonials?.length || 0
}

/**
 * Get all content counts for dashboard
 */
export function getAllContentCounts() {
  return {
    articles: getArticlesCount(),
    portfolio: getPortfolioCount(),
    partners: getPartnersCount(),
    testimonials: getTestimonialsCount(),
  }
}
