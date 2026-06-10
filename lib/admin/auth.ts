import { cookies } from 'next/headers'

export interface Session {
  user: {
    id: string
    username: string
  }
  expiresAt: number
}

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

/**
 * Verify admin password against environment variable
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.error('[Auth] ADMIN_PASSWORD not set in environment variables')
    return false
  }
  
  return password === adminPassword
}

/**
 * Create a new session for authenticated user
 */
export async function createSession(username: string): Promise<Session> {
  const session: Session = {
    user: {
      id: 'admin',
      username,
    },
    expiresAt: Date.now() + SESSION_DURATION,
  }
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  })
  
  return session
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie) {
    return null
  }
  
  try {
    const session: Session = JSON.parse(sessionCookie.value)
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      await destroySession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('[Auth] Failed to parse session cookie:', error)
    return null
  }
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}
