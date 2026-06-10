import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    // Verify password
    const isValid = verifyPassword(password)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    // Create session
    const session = await createSession('admin')
    
    return NextResponse.json({
      success: true,
      user: session.user,
    })
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
