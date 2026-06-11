import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [invoices, payments] = await Promise.all([
      db.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
      db.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
    ])
    return NextResponse.json({ invoices, payments })
  } catch (error) {
    console.error('Error fetching facturation data:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
