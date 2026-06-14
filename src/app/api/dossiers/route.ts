import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const number = `TRS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
    return NextResponse.json({ ...body, number, id: Date.now().toString(), status: 'Ouvert', createdAt: new Date().toISOString() }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
