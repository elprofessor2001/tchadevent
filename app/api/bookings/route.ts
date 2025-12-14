import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export const runtime = 'nodejs'

// GET - Récupérer les réservations de l'utilisateur connecté
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const bookings = await prisma.bookings.findMany({
      where: { user_id: userId },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                event_date: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer les réservations' }, { status: 500 })
  }
}

// POST - Créer une réservation
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const body = await req.json()
    const { ticket_id, quantity } = body

    // Vérifier que le billet existe et a de la disponibilité
    const ticket = await prisma.tickets.findUnique({
      where: { id: ticket_id },
      include: {
        event: true,
        bookings: true,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Billet non trouvé' }, { status: 404 })
    }

    // Calculer les billets déjà réservés
    const bookedQuantity = ticket.bookings.reduce((sum, booking) => sum + (booking.quantity || 0), 0)
    const available = (ticket.quantity || 0) - bookedQuantity

    if (available < quantity) {
      return NextResponse.json({ error: 'Pas assez de billets disponibles' }, { status: 400 })
    }

    // Créer la réservation
    const booking = await prisma.bookings.create({
      data: {
        user_id: userId,
        ticket_id,
        quantity,
      },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                event_date: true,
                location: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 })
  }
}

