/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'

const TEST_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
vi.stubEnv('ENCRYPTION_KEY', TEST_KEY)

const { encrypt, decrypt, isEncrypted, maskApiKey } = await import('./encryption')

describe('Encryption Utilities', () => {
  describe('encrypt', () => {
    it('should encrypt a plaintext string', () => {
      const plaintext = 'sk-test-api-key-12345'
      const encrypted = encrypt(plaintext)
      expect(encrypted).not.toBe(plaintext)
    })

    it('should produce different ciphertext for same plaintext', () => {
      const encrypted1 = encrypt('same-value')
      const encrypted2 = encrypt('same-value')
      expect(encrypted1).not.toBe(encrypted2)
    })
  })

  describe('decrypt', () => {
    it('should decrypt back to original', () => {
      const plaintext = 'sk-test-api-key-12345'
      const encrypted = encrypt(plaintext)
      expect(decrypt(encrypted)).toBe(plaintext)
    })
  })

  describe('isEncrypted', () => {
    it('should return true for encrypted values', () => {
      expect(isEncrypted(encrypt('test'))).toBe(true)
    })

    it('should return false for null/undefined', () => {
      expect(isEncrypted(null)).toBe(false)
      expect(isEncrypted(undefined)).toBe(false)
    })
  })

  describe('maskApiKey', () => {
    it('should mask API keys', () => {
      expect(maskApiKey('sk-test-1234567890abcdefghijklmnop')).toContain('sk-t')
    })

    it('should handle short keys', () => {
      expect(maskApiKey('12345678')).toBe('********')
    })
  })
})