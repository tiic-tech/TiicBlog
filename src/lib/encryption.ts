import crypto from 'crypto'

/**
 * Encryption utility for sensitive data like API keys
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 32

/**
 * Get encryption key from environment variable
 * Must be a 32-byte (256-bit) hex string
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
  }

  return Buffer.from(key, 'hex')
}

/**
 * Derive a key from the master key using salt
 */
function deriveKey(masterKey: Buffer, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256')
}

/**
 * Encrypt a plaintext string
 */
export function encrypt(plaintext: string): string {
  const masterKey = getEncryptionKey()
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = deriveKey(masterKey, salt)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()
  const combined = Buffer.concat([salt, iv, authTag, encrypted])

  return combined.toString('base64')
}

/**
 * Decrypt a base64-encoded encrypted string
 */
export function decrypt(encryptedData: string): string {
  const masterKey = getEncryptionKey()
  const combined = Buffer.from(encryptedData, 'base64')

  const salt = combined.subarray(0, SALT_LENGTH)
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const authTag = combined.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  )
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)

  const key = deriveKey(masterKey, salt)
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  try {
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ])
    return decrypted.toString('utf8')
  } catch {
    throw new Error('Decryption failed: data may be corrupted or tampered with')
  }
}

/**
 * Check if a value appears to be encrypted
 */
export function isEncrypted(value: string | null | undefined): boolean {
  if (!value) return false
  if (value.length < 88) return false
  const base64Regex = /^[A-Za-z0-9+/]+=*$/
  return base64Regex.test(value)
}

/**
 * Mask an API key for display
 */
export function maskApiKey(apiKey: string | null | undefined): string {
  if (!apiKey) return ''
  if (apiKey.length <= 8) return '*'.repeat(apiKey.length)

  const start = apiKey.slice(0, 4)
  const end = apiKey.slice(-4)
  const middle = '*'.repeat(Math.min(apiKey.length - 8, 20))

  return `${start}${middle}${end}`
}