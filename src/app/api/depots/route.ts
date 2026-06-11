import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [depots, movements, containers] = await Promise.all([
      db.depot.findMany(),
      db.depotMovement.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
      db.container.findMany(),
    ])
    return NextResponse.json({ depots, movements, containers })
  } catch (error) {
    console.error('Error fetching depots data:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
