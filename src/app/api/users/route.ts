import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (active !== null && active !== undefined) where.active = active === 'true'

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        phone: true,
        initials: true,
        active: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })

    const usersWithParsedPerms = users.map((u) => ({
      ...u,
      permissions: JSON.parse(u.permissions || '[]'),
    }))

    return NextResponse.json(usersWithParsedPerms)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, name, email, password, role, permissions, phone, initials } = body as {
      username: string
      name: string
      email: string
      password: string
      role: string
      permissions: string[]
      phone?: string
      initials?: string
    }

    if (!username || !name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Check if username or email already exists
    const existing = await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur ou email déjà utilisé' },
        { status: 409 }
      )
    }

    const user = await db.user.create({
      data: {
        username,
        name,
        email,
        password,
        role,
        permissions: JSON.stringify(permissions || []),
        phone: phone || null,
        initials: initials || name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
      },
    })

    return NextResponse.json({ id: user.id, message: 'Utilisateur créé avec succès' }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, email, role, permissions, phone, initials, active } = body as {
      id: string
      name?: string
      email?: string
      role?: string
      permissions?: string[]
      phone?: string
      initials?: string
      active?: boolean
    }

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (email !== undefined) data.email = email
    if (role !== undefined) data.role = role
    if (permissions !== undefined) data.permissions = JSON.stringify(permissions)
    if (phone !== undefined) data.phone = phone
    if (initials !== undefined) data.initials = initials
    if (active !== undefined) data.active = active

    const user = await db.user.update({
      where: { id },
      data,
    })

    return NextResponse.json({ id: user.id, message: 'Utilisateur mis à jour' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await db.user.delete({ where: { id } })

    return NextResponse.json({ message: 'Utilisateur supprimé' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
