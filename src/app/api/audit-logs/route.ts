import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity = searchParams.get('entity')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}
    if (entity) where.entity = entity
    if (userId) where.userId = userId
    if (action) where.action = action

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, username: true, role: true, initials: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.auditLog.count({ where }),
    ])

    return NextResponse.json({ logs, total, limit, offset })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, entity, entityId, details } = body as {
      userId?: string
      action: string
      entity: string
      entityId?: string
      details?: string
    }

    if (!action || !entity) {
      return NextResponse.json(
        { error: 'Action et entité requises' },
        { status: 400 }
      )
    }

    const log = await db.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        details: details || null,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
