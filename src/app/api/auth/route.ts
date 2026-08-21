import { NextResponse } from 'next/server'
import { validateCredentials, generateToken, authenticateRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password, action } = body

    if (action === 'verify') {
      const payload = authenticateRequest(req)
      if (payload) {
        return NextResponse.json({ valid: true, user: payload.user })
      }
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username and password required' }, { status: 400 })
    }

    if (validateCredentials(username, password)) {
      const token = generateToken(username)
      return NextResponse.json({
        success: true,
        token,
        user: username
      })
    }

    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || 'Invalid request' }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const payload = authenticateRequest(req)
  if (payload) {
    return NextResponse.json({ authenticated: true, user: payload.user })
  }
  return NextResponse.json({ authenticated: false }, { status: 401 })
}
