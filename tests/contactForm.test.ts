import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { contactSchema } from '@/components/forms/contactSchema'

const validBase = {
  fullName: 'Test İstifadəçi',
  email: 'test@example.com',
  message: 'Bu test mesajıdır, ən azı 10 karakter.',
}

describe('Contact form schema — correctness properties', () => {
  // Property 1: Standard RFC-compliant emails (alphanumeric local part) are accepted
  it('standard email addresses are accepted', () => {
    // Use a constrained arbitrary that generates emails Zod accepts
    const safeEmail = fc.tuple(
      fc.stringMatching(/^[a-z0-9]+$/),
      fc.stringMatching(/^[a-z0-9]+$/),
      fc.constantFrom('com', 'net', 'org', 'az', 'io')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`)

    fc.assert(
      fc.property(safeEmail, (email) => {
        const result = contactSchema.safeParse({ ...validBase, email })
        expect(result.success).toBe(true)
      })
    )
  })

  // Property 2: String without @ is always rejected as email
  it('string without @ is always rejected as email', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => !s.includes('@')),
        (email) => {
          const result = contactSchema.safeParse({ ...validBase, email })
          expect(result.success).toBe(false)
        }
      )
    )
  })

  // Property 3: Message shorter than 10 chars is rejected
  it('message shorter than 10 chars is rejected', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 9 }),
        (message) => {
          const result = contactSchema.safeParse({ ...validBase, message })
          expect(result.success).toBe(false)
        }
      )
    )
  })

  // Property 4: Message of 10+ chars is accepted (with valid other fields)
  it('message of 10+ chars is accepted', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 500 }),
        (message) => {
          const result = contactSchema.safeParse({ ...validBase, message })
          expect(result.success).toBe(true)
        }
      )
    )
  })

  // Property 5: fullName shorter than 2 chars is rejected
  it('fullName shorter than 2 chars is rejected', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 1 }),
        (fullName) => {
          const result = contactSchema.safeParse({ ...validBase, fullName })
          expect(result.success).toBe(false)
        }
      )
    )
  })

  // Property 6: Honeypot filled → still parses (server handles rejection)
  it('honeypot field is optional and accepts empty string', () => {
    const result = contactSchema.safeParse({ ...validBase, honeypot: '' })
    expect(result.success).toBe(true)
  })

  // Property 7: Honeypot with content is rejected by schema
  it('honeypot with content is rejected', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (honeypot) => {
          const result = contactSchema.safeParse({ ...validBase, honeypot })
          expect(result.success).toBe(false)
        }
      )
    )
  })
})
