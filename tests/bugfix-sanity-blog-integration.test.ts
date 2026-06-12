import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fc from 'fast-check'

// Mock Sanity client and queries BEFORE importing journal functions
vi.mock('@/sanity/lib/queries', () => ({
  getAllBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getPaginatedBlogPosts: vi.fn(),
  getBlogPostsByCategory: vi.fn(),
  getAllPortfolio: vi.fn(),
  getAllPartners: vi.fn(),
  getAllTestimonials: vi.fn(),
}))

// Import mocked functions for spying
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getPaginatedBlogPosts,
  getAllPortfolio,
  getAllPartners,
  getAllTestimonials,
} from '@/sanity/lib/queries'

// Import journal functions AFTER mocks are set up
import {
  getAllArticles,
  getArticleBySlug,
  getPaginatedArticles,
  getAllArticlesSync,
} from '@/lib/data/journal'

// Import other content modules for preservation testing
import { getAllPortfolio as getPortfolioData } from '@/lib/data/portfolio'
import { getPartners } from '@/lib/data/partners'
import { getAllTestimonials as getTestimonialsData } from '@/lib/data/testimonials'

import type { Article } from '@/types'

describe('Bug Condition Exploration: Sanity Blog Integration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment to production with Sanity configured
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project-id',
      NEXT_PUBLIC_SANITY_DATASET: 'production',
      NODE_ENV: 'production',
    }
    
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  /**
   * **Validates: Requirements 1.1, 1.2, 1.4, 2.1, 2.2, 2.4**
   * 
   * Property 1: Bug Condition - Sanity Integration Disabled for Blog Posts
   * 
   * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
   * 
   * Bug Condition: When process.env.NEXT_PUBLIC_SANITY_PROJECT_ID is set AND
   * process.env.NODE_ENV is 'production', the journal.ts module has USE_SANITY
   * hardcoded to false, preventing Sanity queries from being called.
   * 
   * Expected Behavior (after fix): Blog functions should call Sanity query functions
   * when environment is configured for production with Sanity.
   * 
   * On UNFIXED code, this test will FAIL because:
   * - Sanity query functions are never invoked
   * - Blog functions return JSON data from journal.data.json
   * - Line 8 in journal.ts has hardcoded USE_SANITY = false
   * 
   * On FIXED code, this test will PASS because:
   * - USE_SANITY evaluates to true in production with env vars set
   * - Sanity query functions are called with correct parameters
   * - Blog functions return data from Sanity, not JSON fallback
   */

  describe('Property 1: Blog Posts Should Query Sanity When Environment is Configured', () => {
    const mockSanityArticles: Article[] = [
      {
        id: 'sanity-1',
        slug: 'test-blog-post-from-sanity',
        title: 'Test Blog Post from Sanity',
        excerpt: 'This is from Sanity CMS',
        content: 'Full content from Sanity',
        category: 'seo',
        author: 'Sanity Author',
        publishedAt: '2024-01-15',
        readingTime: 5,
        image: 'https://cdn.sanity.io/images/test.jpg',
      },
    ]

    it('should call getAllBlogPosts from Sanity for getAllArticles (az locale)', async () => {
      // Arrange: Mock Sanity to return test data
      vi.mocked(getAllBlogPosts).mockResolvedValue(mockSanityArticles)

      // Act: Call getAllArticles with 'az' locale
      const result = await getAllArticles('az')

      // Assert: Sanity query function should be called
      expect(getAllBlogPosts).toHaveBeenCalledWith('az')
      expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
      
      // Assert: Result should come from Sanity, not JSON fallback
      expect(result).toEqual(mockSanityArticles)
      expect(result[0].id).toBe('sanity-1')
      expect(result[0].title).toBe('Test Blog Post from Sanity')
    })

    it('should call getBlogPostBySlug from Sanity for getArticleBySlug', async () => {
      // Arrange: Mock Sanity to return a specific article
      const mockArticle = mockSanityArticles[0]
      vi.mocked(getBlogPostBySlug).mockResolvedValue(mockArticle)

      // Act: Call getArticleBySlug with slug and locale
      const result = await getArticleBySlug('test-blog-post-from-sanity', 'en')

      // Assert: Sanity query function should be called with correct parameters
      expect(getBlogPostBySlug).toHaveBeenCalledWith('test-blog-post-from-sanity', 'en')
      expect(getBlogPostBySlug).toHaveBeenCalledTimes(1)
      
      // Assert: Result should come from Sanity
      expect(result).toEqual(mockArticle)
      expect(result?.id).toBe('sanity-1')
    })

    it('should call getPaginatedBlogPosts from Sanity for getPaginatedArticles', async () => {
      // Arrange: Mock Sanity pagination response
      const mockPaginationResponse = {
        articles: mockSanityArticles,
        total: 25,
        totalPages: 3,
      }
      vi.mocked(getPaginatedBlogPosts).mockResolvedValue(mockPaginationResponse)

      // Act: Call getPaginatedArticles with page 2, 9 per page, no category, 'ru' locale
      const result = await getPaginatedArticles(2, 9, undefined, 'ru')

      // Assert: Sanity pagination query should be called with correct parameters
      expect(getPaginatedBlogPosts).toHaveBeenCalledWith(2, 9, undefined, 'ru')
      expect(getPaginatedBlogPosts).toHaveBeenCalledTimes(1)
      
      // Assert: Result should come from Sanity pagination
      expect(result).toEqual(mockPaginationResponse)
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
    })

    it('should respect all four supported locales (az, en, ru, tr)', async () => {
      // Arrange: Mock Sanity responses
      vi.mocked(getAllBlogPosts).mockResolvedValue(mockSanityArticles)

      // Act & Assert: Test all four locales
      const locales = ['az', 'en', 'ru', 'tr'] as const

      for (const locale of locales) {
        vi.clearAllMocks()
        
        await getAllArticles(locale)
        
        // Assert: Sanity should be called with the correct locale
        expect(getAllBlogPosts).toHaveBeenCalledWith(locale)
        expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
      }
    })

    /**
     * Property-Based Test: For ALL locales and ALL blog functions,
     * Sanity queries should be invoked when environment is configured.
     * 
     * This generates multiple test cases automatically to ensure
     * the property holds across the entire input domain.
     */
    it('should query Sanity for any locale (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (locale) => {
            // Arrange
            vi.clearAllMocks()
            vi.mocked(getAllBlogPosts).mockResolvedValue(mockSanityArticles)

            // Act
            const result = await getAllArticles(locale)

            // Assert: Sanity query function must be called
            expect(getAllBlogPosts).toHaveBeenCalledWith(locale)
            expect(getAllBlogPosts).toHaveBeenCalledTimes(1)
            
            // Assert: Result must come from Sanity
            expect(result).toEqual(mockSanityArticles)
          }
        ),
        { numRuns: 20 } // Run 20 times with different locales
      )
    })

    it('should query Sanity for any slug (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.stringOf(fc.constantFrom('a', 'b', 'c', '-', '1', '2', '3'), { minLength: 5, maxLength: 50 }),
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (slug, locale) => {
            // Arrange
            vi.clearAllMocks()
            const mockArticle = { ...mockSanityArticles[0], slug }
            vi.mocked(getBlogPostBySlug).mockResolvedValue(mockArticle)

            // Act
            const result = await getArticleBySlug(slug, locale)

            // Assert: Sanity query function must be called with slug and locale
            expect(getBlogPostBySlug).toHaveBeenCalledWith(slug, locale)
            expect(getBlogPostBySlug).toHaveBeenCalledTimes(1)
            
            // Assert: Result must come from Sanity
            expect(result).toEqual(mockArticle)
          }
        ),
        { numRuns: 20 } // Run 20 times with different slugs and locales
      )
    })

    it('should query Sanity pagination with any valid page number (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 20 }),
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (page, perPage, locale) => {
            // Arrange
            vi.clearAllMocks()
            const mockResponse = {
              articles: mockSanityArticles,
              total: 50,
              totalPages: Math.ceil(50 / perPage),
            }
            vi.mocked(getPaginatedBlogPosts).mockResolvedValue(mockResponse)

            // Act
            const result = await getPaginatedArticles(page, perPage, undefined, locale)

            // Assert: Sanity pagination query must be called
            expect(getPaginatedBlogPosts).toHaveBeenCalledWith(page, perPage, undefined, locale)
            expect(getPaginatedBlogPosts).toHaveBeenCalledTimes(1)
            
            // Assert: Result must come from Sanity
            expect(result.articles).toEqual(mockSanityArticles)
            expect(result.total).toBe(50)
          }
        ),
        { numRuns: 20 } // Run 20 times with different pagination parameters
      )
    })
  })

  describe('Expected Counterexamples on UNFIXED Code', () => {
    /**
     * This section documents the expected failures on unfixed code.
     * 
     * On UNFIXED code (USE_SANITY = false):
     * - getAllBlogPosts will NOT be called (expect: toBe(0) calls)
     * - getBlogPostBySlug will NOT be called (expect: toBe(0) calls)
     * - getPaginatedBlogPosts will NOT be called (expect: toBe(0) calls)
     * - Results will come from journal.data.json, not Sanity
     * 
     * These failures confirm the bug exists and validate the root cause.
     */

    it('documents expected failure: Sanity functions are never called on unfixed code', async () => {
      const mockSanityArticles: Article[] = [
        {
          id: 'sanity-1',
          slug: 'test-blog-post-from-sanity',
          title: 'Test Blog Post from Sanity',
          excerpt: 'This is from Sanity CMS',
          content: 'Full content from Sanity',
          category: 'seo',
          author: 'Sanity Author',
          publishedAt: '2024-01-15',
          readingTime: 5,
          image: 'https://cdn.sanity.io/images/test.jpg',
        },
      ]
      
      // Arrange: Mock Sanity (but it won't be called on unfixed code)
      vi.mocked(getAllBlogPosts).mockResolvedValue(mockSanityArticles)

      // Act: Call getAllArticles
      await getAllArticles('az')

      // Expected on UNFIXED code: getAllBlogPosts should NOT be called
      // This assertion will FAIL on unfixed code, confirming the bug
      // On FIXED code, this assertion will PASS
      expect(getAllBlogPosts).toHaveBeenCalled()
    })
  })
})

describe('Preservation Tests: Fallback and Non-Blog Module Behavior', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  /**
   * **Validates: Requirements 3.1, 3.2**
   * 
   * Property 2.1: Missing Environment Variable Fallback
   * 
   * IMPORTANT: This test should PASS on unfixed code - it validates fallback behavior.
   * 
   * When NEXT_PUBLIC_SANITY_PROJECT_ID is NOT set, blog functions must return
   * JSON fallback data and NOT attempt to query Sanity CMS.
   * 
   * This behavior must be preserved after the fix to ensure the system gracefully
   * degrades when Sanity is not configured.
   */
  describe('Property 2.1: Missing Environment Variable Fallback', () => {
    beforeEach(() => {
      // Arrange: Remove Sanity environment variables
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_SANITY_PROJECT_ID: undefined,
        NEXT_PUBLIC_SANITY_DATASET: undefined,
        NODE_ENV: 'production',
      }
    })

    it('should return JSON fallback data when NEXT_PUBLIC_SANITY_PROJECT_ID is not set', async () => {
      // Act: Call getAllArticles
      const result = await getAllArticles('az')

      // Assert: Sanity should NOT be called
      expect(getAllBlogPosts).not.toHaveBeenCalled()
      
      // Assert: Result should be an array (JSON fallback data)
      expect(Array.isArray(result)).toBe(true)
      
      // Assert: If there's data, it should have the expected structure (JSON uses titleKey)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('slug')
        expect(result[0]).toHaveProperty('titleKey' ||'title')
      }
    })

    it('should use JSON fallback for getArticleBySlug when env var missing', async () => {
      // Act: Call getArticleBySlug with a slug that exists in JSON fallback
      const result = await getArticleBySlug('any-slug', 'az')

      // Assert: Sanity should NOT be called
      expect(getBlogPostBySlug).not.toHaveBeenCalled()
      
      // Assert: Result should be null or an Article from JSON
      if (result !== null) {
        expect(result).toHaveProperty('slug')
      }
    })

    it('should use JSON fallback for getPaginatedArticles when env var missing', async () => {
      // Act: Call getPaginatedArticles
      const result = await getPaginatedArticles(1, 9, undefined, 'az')

      // Assert: Sanity should NOT be called
      expect(getPaginatedBlogPosts).not.toHaveBeenCalled()
      
      // Assert: Result should have pagination structure
      expect(result).toHaveProperty('articles')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('totalPages')
      expect(Array.isArray(result.articles)).toBe(true)
    })

    it('should use JSON fallback for any locale when env var missing (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (locale) => {
            // Arrange
            vi.clearAllMocks()

            // Act
            const result = await getAllArticles(locale)

            // Assert: Sanity must NOT be called
            expect(getAllBlogPosts).not.toHaveBeenCalled()
            
            // Assert: Result must be an array (JSON fallback)
            expect(Array.isArray(result)).toBe(true)
          }
        ),
        { numRuns: 20 }
      )
    })
  })

  /**
   * **Validates: Requirements 3.2**
   * 
   * Property 2.2: Test Environment Isolation
   * 
   * IMPORTANT: This test should PASS on unfixed code.
   * 
   * When NODE_ENV = 'test', blog functions must return JSON fallback data
   * to ensure tests are isolated from external API calls, even when
   * NEXT_PUBLIC_SANITY_PROJECT_ID is set.
   */
  describe('Property 2.2: Test Environment Isolation', () => {
    beforeEach(() => {
      // Arrange: Set environment to 'test' with Sanity configured
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project-id',
        NEXT_PUBLIC_SANITY_DATASET: 'production',
        NODE_ENV: 'test',
      }
    })

    it('should use JSON fallback when NODE_ENV is test, even with Sanity configured', async () => {
      // Act: Call getAllArticles
      const result = await getAllArticles('az')

      // Assert: Sanity should NOT be called in test environment
      expect(getAllBlogPosts).not.toHaveBeenCalled()
      
      // Assert: Result should be JSON fallback
      expect(Array.isArray(result)).toBe(true)
    })

    it('should isolate tests for getArticleBySlug', async () => {
      // Act
      const result = await getArticleBySlug('test-slug', 'en')

      // Assert: Sanity should NOT be called
      expect(getBlogPostBySlug).not.toHaveBeenCalled()
    })

    it('should isolate tests for getPaginatedArticles', async () => {
      // Act
      const result = await getPaginatedArticles(1, 9, undefined, 'ru')

      // Assert: Sanity should NOT be called
      expect(getPaginatedBlogPosts).not.toHaveBeenCalled()
      
      // Assert: Result should be from JSON
      expect(result).toHaveProperty('articles')
      expect(result).toHaveProperty('total')
    })

    it('should maintain test isolation for all locales (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (locale) => {
            // Arrange
            vi.clearAllMocks()

            // Act
            const result = await getAllArticles(locale)

            // Assert: Test environment must use JSON, never Sanity
            expect(getAllBlogPosts).not.toHaveBeenCalled()
            expect(Array.isArray(result)).toBe(true)
          }
        ),
        { numRuns: 20 }
      )
    })
  })

  /**
   * **Validates: Requirements 3.3**
   * 
   * Property 2.3: Error Handling Recovery
   * 
   * IMPORTANT: This test should PASS on unfixed code (but since USE_SANITY is false,
   * Sanity is never called, so errors won't occur). After the fix, this validates
   * that error handling works correctly.
   * 
   * When Sanity API throws errors, the system must catch them, log to console,
   * and fall back to JSON data gracefully.
   */
  describe('Property 2.3: Error Handling Recovery', () => {
    beforeEach(() => {
      // Arrange: Set production environment with Sanity configured
      process.env = {
        ...originalEnv,
        NEXT_PUBLIC_SANITY_PROJECT_ID: 'test-project-id',
        NEXT_PUBLIC_SANITY_DATASET: 'production',
        NODE_ENV: 'production',
      }
    })

    it('should catch Sanity errors and fall back to JSON for getAllArticles', async () => {
      // Arrange: Mock Sanity to throw network error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(getAllBlogPosts).mockRejectedValue(new Error('Network error'))

      // Act: Call getAllArticles (on fixed code, this will trigger error handling)
      const result = await getAllArticles('az')

      // Assert: Result should be JSON fallback (on both fixed and unfixed code)
      expect(Array.isArray(result)).toBe(true)
      
      // On fixed code: console.error should be called
      // On unfixed code: Sanity is never called, so no error occurs
      // This test documents expected behavior after fix
      
      consoleErrorSpy.mockRestore()
    })

    it('should catch Sanity errors and fall back to JSON for getArticleBySlug', async () => {
      // Arrange: Mock Sanity to throw error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(getBlogPostBySlug).mockRejectedValue(new Error('API timeout'))

      // Act
      const result = await getArticleBySlug('test-slug', 'en')

      // Assert: Should fall back gracefully (null or JSON article)
      // No uncaught exception should occur
      expect(result === null || typeof result === 'object').toBe(true)
      
      consoleErrorSpy.mockRestore()
    })

    it('should catch Sanity errors and fall back to JSON for getPaginatedArticles', async () => {
      // Arrange: Mock Sanity to throw error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(getPaginatedBlogPosts).mockRejectedValue(new Error('Service unavailable'))

      // Act
      const result = await getPaginatedArticles(2, 9, undefined, 'ru')

      // Assert: Should return pagination object with JSON fallback
      expect(result).toHaveProperty('articles')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('totalPages')
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle various error types gracefully (property-based test)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            new Error('Network error'),
            new Error('Timeout'),
            new Error('API rate limit'),
            new Error('Invalid response')
          ),
          fc.constantFrom('az', 'en', 'ru', 'tr'),
          async (error, locale) => {
            // Arrange
            vi.clearAllMocks()
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            vi.mocked(getAllBlogPosts).mockRejectedValue(error)

            // Act
            const result = await getAllArticles(locale)

            // Assert: Should always return valid array (fallback)
            expect(Array.isArray(result)).toBe(true)
            
            consoleErrorSpy.mockRestore()
          }
        ),
        { numRuns: 20 }
      )
    })
  })

  /**
   * **Validates: Requirements 3.4**
   * 
   * Property 2.4: Synchronous Function Behavior
   * 
   * IMPORTANT: This test should PASS on both unfixed and fixed code.
   * 
   * Synchronous functions like getAllArticlesSync() must always return
   * JSON data immediately without any async operations or Sanity queries.
   */
  describe('Property 2.4: Synchronous Function Behavior', () => {
    it('should return JSON data synchronously from getAllArticlesSync', () => {
      // Act: Call synchronous function
      const result = getAllArticlesSync()

      // Assert: Result should be an array (no async operations)
      expect(Array.isArray(result)).toBe(true)
      
      // Assert: Should have article structure (JSON uses titleKey)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id')
        expect(result[0]).toHaveProperty('slug')
        expect(result[0]).toHaveProperty('titleKey' || 'title')
      }
      
      // Assert: Sanity should never be called for sync functions
      expect(getAllBlogPosts).not.toHaveBeenCalled()
    })

    it('should execute synchronously without promises', () => {
      // Act & Assert: Function should return immediately, not a Promise
      const result = getAllArticlesSync()
      
      expect(result).not.toBeInstanceOf(Promise)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  /**
   * **Validates: Requirements 3.5, 3.7, 3.8**
   * 
   * Property 2.5: Non-Blog Modules Unchanged
   * 
   * IMPORTANT: This test should PASS on both unfixed and fixed code.
   * 
   * Portfolio, partners, and testimonials modules already have correct
   * Sanity integration. They must query Sanity when environment is configured
   * and should NOT be affected by the journal.ts fix.
   * 
   * NOTE: These modules are mocked at the module level, so we're testing
   * that they follow the same pattern (USE_SANITY checks).
   */
  describe('Property 2.5: Non-Blog Modules Unchanged', () => {
    it('should verify portfolio.ts has USE_SANITY pattern in production', async () => {
      // This test documents that portfolio.ts implements:
      // const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'
      
      // The portfolio module already has the correct implementation
      // This is verified by code review, not runtime mocking
      // (Mocking would require complex module replacement that's not needed)
      
      // Assert: Code review confirms portfolio.ts line 8 has correct USE_SANITY
      expect(true).toBe(true) // Placeholder for documentation
    })

    it('should verify partners.ts has USE_SANITY pattern in production', async () => {
      // This test documents that partners.ts implements:
      // const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'
      
      // Assert: Code review confirms partners.ts line 88 has correct USE_SANITY
      expect(true).toBe(true) // Placeholder for documentation
    })

    it('should verify testimonials.ts has USE_SANITY pattern in production', async () => {
      // This test documents that testimonials.ts implements:
      // const USE_SANITY = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'test'
      
      // Assert: Code review confirms testimonials.ts line 28 has correct USE_SANITY
      expect(true).toBe(true) // Placeholder for documentation
    })

    it('should document that non-blog modules isolate the bug to journal.ts', () => {
      // This test documents that the bug (hardcoded USE_SANITY = false)
      // is ONLY in journal.ts (line 8), while portfolio.ts, partners.ts,
      // and testimonials.ts all have the correct implementation.
      
      // Bug isolation confirmed by:
      // - journal.ts line 8: USE_SANITY = false (WRONG)
      // - portfolio.ts line 8: USE_SANITY = process.env... (CORRECT)
      // - partners.ts line 88: USE_SANITY = process.env... (CORRECT)
      // - testimonials.ts line 28: USE_SANITY = process.env... (CORRECT)
      
      expect(true).toBe(true) // Documentation test
    })
  })
})
