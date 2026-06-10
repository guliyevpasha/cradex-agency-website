import { describe, it, expect } from 'vitest'
import { getAllContentCounts, getArticlesCount, getPortfolioCount, getPartnersCount, getTestimonialsCount } from './data'

describe('Admin Data Utils', () => {
  describe('getAllContentCounts', () => {
    it('should return an object with all content counts', () => {
      const counts = getAllContentCounts()
      
      expect(counts).toHaveProperty('articles')
      expect(counts).toHaveProperty('portfolio')
      expect(counts).toHaveProperty('partners')
      expect(counts).toHaveProperty('testimonials')
      
      expect(typeof counts.articles).toBe('number')
      expect(typeof counts.portfolio).toBe('number')
      expect(typeof counts.partners).toBe('number')
      expect(typeof counts.testimonials).toBe('number')
    })

    it('should return non-negative counts', () => {
      const counts = getAllContentCounts()
      
      expect(counts.articles).toBeGreaterThanOrEqual(0)
      expect(counts.portfolio).toBeGreaterThanOrEqual(0)
      expect(counts.partners).toBeGreaterThanOrEqual(0)
      expect(counts.testimonials).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Individual count functions', () => {
    it('getArticlesCount should return a number', () => {
      const count = getArticlesCount()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('getPortfolioCount should return a number', () => {
      const count = getPortfolioCount()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('getPartnersCount should return a number', () => {
      const count = getPartnersCount()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })

    it('getTestimonialsCount should return a number', () => {
      const count = getTestimonialsCount()
      expect(typeof count).toBe('number')
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Empty JSON files', () => {
    it('should handle empty arrays gracefully', () => {
      // Since the JSON files currently have empty arrays, all counts should be 0
      const counts = getAllContentCounts()
      
      expect(counts.articles).toBe(0)
      expect(counts.portfolio).toBe(0)
      expect(counts.partners).toBe(0)
      expect(counts.testimonials).toBe(0)
    })
  })
})
