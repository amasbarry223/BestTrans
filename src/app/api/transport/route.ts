import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [vehicles, missions, chauffeurs] = await Promise.all([
      db.vehicle.findMany({ orderBy: { createdAt: 'desc' } }),
      db.mission.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
      db.user.findMany({ where: { role: 'transport' } }),
    ])
    return NextResponse.json({ vehicles, missions, chauffeurs })
  } catch (error) {
    console.error('Error fetching transport data:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
