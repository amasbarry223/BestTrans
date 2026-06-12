import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const dossiers = await db.dossier.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(dossiers)
  } catch (error) {
    console.error('Error fetching dossiers:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dossier = await db.dossier.create({
      data: {
        number: body.number || `TRS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        type: body.type || 'Import',
        clientName: body.clientName || '',
        regime: body.regime || 'Consommation',
        blLta: body.blLta || '',
        bureau: body.bureau || 'Bamako-Sénou',
        merchandise: body.merchandise || '',
        honoraires: body.honoraires || '0',
        corridor: body.corridor || '',
        status: 'Ouvert',
      },
    })
    return NextResponse.json(dossier, { status: 201 })
  } catch (error) {
    console.error('Error creating dossier:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
