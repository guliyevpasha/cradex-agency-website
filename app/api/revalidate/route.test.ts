import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'

// Mock Next.js revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Token Authentication', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        body: JSON.stringify({ _type: 'blog', slug: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'InvalidToken',
        },
        body: JSON.stringify({ _type: 'blog', slug: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 401 when token does not match', async () => {
      process.env.REVALIDATION_TOKEN = 'correct-token'
      
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer wrong-token',
        },
        body: JSON.stringify({ _type: 'blog', slug: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 200 when valid Bearer token is provided', async () => {
      process.env.REVALIDATION_TOKEN = 'valid-token'
      
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer valid-token',
        },
        body: JSON.stringify({ _type: 'blog', slug: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('revalidated', true)
      expect(data).toHaveProperty('_type', 'blog')
      expect(data).toHaveProperty('slug', 'test')
      expect(data).toHaveProperty('paths')
      expect(data).toHaveProperty('timestamp')
    })

    it('should return 401 when REVALIDATION_TOKEN env var is not set', async () => {
      delete process.env.REVALIDATION_TOKEN
      
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer some-token',
        },
        body: JSON.stringify({ _type: 'blog', slug: 'test' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })
  })

  describe('Request Processing', () => {
    it('should parse and accept valid request body when authenticated', async () => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      
      const requestBody = {
        _type: 'blog',
        slug: 'test-article',
      }

      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.revalidated).toBe(true)
      expect(data._type).toBe('blog')
      expect(data.slug).toBe('test-article')
      expect(data.paths).toBeDefined()
      expect(Array.isArray(data.paths)).toBe(true)
      expect(typeof data.timestamp).toBe('number')
    })

    it('should return 400 when _type is missing', async () => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      
      const requestBody = {
        slug: 'test-article',
      }

      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Missing required field: _type' })
    })

    it('should accept request with _type but no slug', async () => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      
      const requestBody = {
        _type: 'testimonial',
      }

      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data._type).toBe('testimonial')
      expect(data.slug).toBeNull()
    })

    it('should handle all supported content types', async () => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      
      const contentTypes = ['blog', 'article', 'portfolio', 'portfolioItem', 'testimonial', 'partner']

      for (const contentType of contentTypes) {
        const request = new NextRequest('http://localhost:3000/api/revalidate', {
          method: 'POST',
          headers: {
            'authorization': 'Bearer test-token',
          },
          body: JSON.stringify({ _type: contentType, slug: 'test-slug' }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data._type).toBe(contentType)
        expect(data.slug).toBe('test-slug')
      }
    })

    it('should handle malformed JSON with 500 error when authenticated', async () => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
          'content-type': 'application/json',
        },
        body: 'invalid-json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toHaveProperty('error', 'Internal server error')
      expect(data).toHaveProperty('message')
      expect(data).toHaveProperty('timestamp')
      expect(typeof data.timestamp).toBe('number')
    })
  })

  describe('Path Revalidation Logic', () => {
    const locales = ['az', 'en', 'ru', 'tr']

    beforeEach(() => {
      process.env.REVALIDATION_TOKEN = 'test-token'
      vi.clearAllMocks()
    })

    it('should revalidate journal paths for blog/article content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'blog', slug: 'test-article' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([
        '/az/journal',
        '/en/journal',
        '/ru/journal',
        '/tr/journal',
        '/az/journal/test-article',
        '/en/journal/test-article',
        '/ru/journal/test-article',
        '/tr/journal/test-article',
      ])
    })

    it('should revalidate only journal listing when slug is missing for blog', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'article' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([
        '/az/journal',
        '/en/journal',
        '/ru/journal',
        '/tr/journal',
      ])
    })

    it('should revalidate portfolio and homepage for portfolio/portfolioItem content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'portfolio', slug: 'project-1' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([
        '/az/portfolio',
        '/en/portfolio',
        '/ru/portfolio',
        '/tr/portfolio',
        '/az',
        '/en',
        '/ru',
        '/tr',
      ])
    })

    it('should revalidate only homepage for testimonial content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'testimonial' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([
        '/az',
        '/en',
        '/ru',
        '/tr',
      ])
    })

    it('should revalidate only homepage for partner content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'partner' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([
        '/az',
        '/en',
        '/ru',
        '/tr',
      ])
    })

    it('should return empty paths array for unknown content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ _type: 'unknown-type' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.paths).toEqual([])
    })
  })
})
