import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// POST - Incrémenter le compteur de vues
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventModel = (prisma as any).event || (prisma as any).events
    if (!eventModel) {
      return NextResponse.json({ error: 'Prisma Event model not available' }, { status: 500 })
    }
    const event = await eventModel.update({
      where: { id: parseInt(id) },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ views: event.views || 0 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

