import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalDossiers,
      dossiersEnCours,
      totalClients,
      totalVehicles,
      totalInvoices,
      pendingInvoices,
      totalDepots,
    ] = await Promise.all([
      db.dossier.count(),
      db.dossier.count({ where: { status: { not: 'Clôturé' } } }),
      db.client.count({ where: { status: 'Actif' } }),
      db.vehicle.count(),
      db.invoice.count(),
      db.invoice.count({ where: { status: 'En attente' } }),
      db.depot.count(),
    ])

    return NextResponse.json({
      totalDossiers,
      dossiersEnCours,
      totalClients,
      totalVehicles,
      totalInvoices,
      pendingInvoices,
      totalDepots,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
