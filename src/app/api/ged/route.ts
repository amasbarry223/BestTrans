import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const documents = await db.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
