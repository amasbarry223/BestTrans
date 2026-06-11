import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clients = await db.client.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const client = await db.client.create({
      data: {
        name: body.name || '',
        nif: body.nif || null,
        rccm: body.rccm || null,
        type: body.type || 'Importateur',
        contact: body.contact || null,
        phone: body.phone || null,
        email: body.email || null,
        encours: '0',
        plafond: body.plafond || '10000000',
      },
    })
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
