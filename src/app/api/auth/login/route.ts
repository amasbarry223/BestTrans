import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, encodeAuthUser, AUTH_COOKIE, AUTH_MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body as { identifier: string; password: string }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Identifiant et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = validateCredentials(identifier, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ user })
    response.cookies.set(AUTH_COOKIE, encodeAuthUser(user), {
      path: '/',
      maxAge: AUTH_MAX_AGE,
      httpOnly: false,
      sameSite: 'lax',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
