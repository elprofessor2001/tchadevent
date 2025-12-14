import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

// GET - Récupérer un événement par ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventModel = (prisma as any).event || (prisma as any).events
    if (!eventModel) {
      return NextResponse.json({ error: 'Prisma Event model not available' }, { status: 500 })
    }
    const event = await eventModel.findUnique({
      where: { id: parseInt(id) },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
          },
        },
        tickets: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer l\'événement' }, { status: 500 })
  }
}

// PUT - Mettre à jour un événement (organisateur ou admin)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const eventModel = (prisma as any).event || (prisma as any).events
    if (!eventModel) {
      return NextResponse.json({ error: 'Prisma Event model not available' }, { status: 500 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const event = await eventModel.findUnique({ where: { id: parseInt(id) } })

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
    }

    if (user?.role !== 'admin' && event.organizer_id !== userId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, location, event_date, image, category, tickets } = body

    // Mettre à jour l'événement
    const updatedEvent = await eventModel.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        location,
        event_date: event_date ? new Date(event_date) : undefined,
        image,
        category: category || undefined,
      },
      include: {
        tickets: true,
      },
    })

    // Gérer les tickets si fournis
    if (tickets && Array.isArray(tickets)) {
      // Récupérer les tickets existants
      const existingTickets = await prisma.ticket.findMany({
        where: { eventId: parseInt(id) },
      })

      const existingTicketIds = existingTickets.map(t => t.id)
      const providedTicketIds = tickets
        .filter((t: any) => t.id)
        .map((t: any) => t.id)

      // Supprimer les tickets qui ne sont plus dans la liste
      const ticketsToDelete = existingTicketIds.filter(
        id => !providedTicketIds.includes(id)
      )
      if (ticketsToDelete.length > 0) {
        await prisma.ticket.deleteMany({
          where: {
            id: { in: ticketsToDelete },
            eventId: parseInt(id),
          },
        })
      }

      // Créer ou mettre à jour les tickets
      for (const ticket of tickets) {
        if (ticket.id) {
          // Mettre à jour un ticket existant
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              name: ticket.name,
              price: ticket.price || 0,
              quantity: ticket.quantity || 0,
            },
          })
        } else {
          // Créer un nouveau ticket
          await prisma.ticket.create({
            data: {
              eventId: parseInt(id),
              name: ticket.name,
              price: ticket.price || 0,
              quantity: ticket.quantity || 0,
            },
          })
        }
      }
    }

    // Retourner l'événement mis à jour avec ses tickets
    const finalEvent = await eventModel.findUnique({
      where: { id: parseInt(id) },
      include: {
        tickets: true,
      },
    })

    return NextResponse.json(finalEvent)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

// DELETE - Supprimer un événement (organisateur ou admin)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const eventModel = (prisma as any).event || (prisma as any).events
    if (!eventModel) {
      return NextResponse.json({ error: 'Prisma Event model not available' }, { status: 500 })
    }
    const event = await eventModel.findUnique({ where: { id: parseInt(id) } })

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 })
    }

    if (user?.role !== 'admin' && event.organizer_id !== userId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    await eventModel.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Événement supprimé' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

