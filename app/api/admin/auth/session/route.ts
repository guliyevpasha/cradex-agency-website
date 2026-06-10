import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      expiresAt: session.expiresAt,
    })
  } catch (error) {
    console.error('[Session] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
