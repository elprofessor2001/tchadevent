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

    // Utiliser le modèle Booking (Prisma convertit automatiquement en minuscule)
    const bookingModel = (prisma as any).booking || (prisma as any).bookings
    if (!bookingModel) {
      return NextResponse.json({ error: 'Prisma Booking model not available' }, { status: 500 })
    }

    const bookings = await bookingModel.findMany({
      where: { userId: userId },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                eventDate: true,
                location: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Mapper les champs camelCase vers snake_case pour la compatibilité avec le frontend
    const bookingsWithSnakeCase = bookings.map((booking: any) => ({
      ...booking,
      created_at: booking.createdAt,
      ticket: {
        ...booking.ticket,
        event: {
          ...booking.ticket.event,
          event_date: booking.ticket.event.eventDate,
        },
      },
    }))

    return NextResponse.json(bookingsWithSnakeCase)
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

    // Utiliser le modèle Ticket
    const ticketModel = (prisma as any).ticket || (prisma as any).tickets
    if (!ticketModel) {
      return NextResponse.json({ error: 'Prisma Ticket model not available' }, { status: 500 })
    }

    // Vérifier que le billet existe et a de la disponibilité
    const ticket = await ticketModel.findUnique({
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
    const bookedQuantity = ticket.bookings.reduce((sum: number, booking: any) => sum + (booking.quantity || 0), 0)
    const available = (ticket.quantity || 0) - bookedQuantity

    if (available < quantity) {
      return NextResponse.json({ error: 'Pas assez de billets disponibles' }, { status: 400 })
    }

    // Utiliser le modèle Booking
    const bookingModel = (prisma as any).booking || (prisma as any).bookings
    if (!bookingModel) {
      return NextResponse.json({ error: 'Prisma Booking model not available' }, { status: 500 })
    }

    // Créer la réservation
    const booking = await bookingModel.create({
      data: {
        userId: userId,
        ticketId: ticket_id,
        quantity,
      },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                eventDate: true,
                location: true,
              },
            },
          },
        },
      },
    })

    // Mapper les champs camelCase vers snake_case pour la compatibilité avec le frontend
    const bookingWithSnakeCase = {
      ...booking,
      created_at: booking.createdAt,
      ticket: {
        ...booking.ticket,
        event: {
          ...booking.ticket.event,
          event_date: booking.ticket.event.eventDate,
        },
      },
    }

    return NextResponse.json(bookingWithSnakeCase, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 })
  }
}

