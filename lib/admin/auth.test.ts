import { describe, it, expect, beforeEach, vi } from 'vitest'
import { verifyPassword } from './auth'

describe('Admin Authentication', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    vi.resetModules()
  })

  describe('verifyPassword', () => {
    it('should return true for correct password', () => {
      process.env.ADMIN_PASSWORD = 'test-password'
      expect(verifyPassword('test-password')).toBe(true)
    })

    it('should return false for incorrect password', () => {
      process.env.ADMIN_PASSWORD = 'test-password'
      expect(verifyPassword('wrong-password')).toBe(false)
    })

    it('should return false when ADMIN_PASSWORD is not set', () => {
      delete process.env.ADMIN_PASSWORD
      expect(verifyPassword('any-password')).toBe(false)
    })

    it('should handle empty password', () => {
      process.env.ADMIN_PASSWORD = 'test-password'
      expect(verifyPassword('')).toBe(false)
    })
  })
})
