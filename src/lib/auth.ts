import crypto from 'crypto'

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback_dev_secret_key_change_in_production'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Token validity duration: 24 hours
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000

interface TokenPayload {
  user: string
  exp: number
}

/**
 * Generate a signed auth token for the admin user.
 * Format: base64(payload).hmac_signature
 */
export function generateToken(username: string): string {
  const payload: TokenPayload = {
    user: username,
    exp: Date.now() + TOKEN_EXPIRY_MS
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url')
  return `${payloadB64}.${signature}`
}

/**
 * Verify a token and return the payload if valid, or null if invalid/expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  if (!token || !token.includes('.')) return null

  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) return null

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadB64)
    .digest('base64url')

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null
  }

  // Decode and check expiry
  try {
    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Validate admin credentials against environment variables.
 * Enforces that ADMIN_PASSWORD must be configured in environment.
 */
export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable is not configured.')
    return false
  }
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

/**
 * Extract and verify the Bearer token from a request's Authorization header.
 * Returns the payload if valid, or null if unauthorized.
 */
export function authenticateRequest(req: Request): TokenPayload | null {
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return verifyToken(token)
}

/**
 * Helper to return a 401 JSON response.
 */
export function unauthorizedResponse() {
  return Response.json(
    { error: 'Unauthorized — valid admin token required' },
    { status: 401 }
  )
}
