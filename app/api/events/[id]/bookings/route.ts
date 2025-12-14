import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// GET - Récupérer toutes les réservations pour un événement (pour calculer les places disponibles)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventId = parseInt(id)

    // Récupérer tous les billets de l'événement
    const tickets = await prisma.ticket.findMany({
      where: { eventId: eventId },
      include: {
        bookings: true,
      },
    })

    // Calculer les places disponibles pour chaque billet
    const availability = tickets.map((ticket) => {
      const booked = ticket.bookings.reduce((sum, booking) => sum + (booking.quantity || 0), 0)
      return {
        ticket_id: ticket.id,
        total: ticket.quantity || 0,
        booked,
        available: (ticket.quantity || 0) - booked,
      }
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer la disponibilité' }, { status: 500 })
  }
}

