import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export const runtime = 'nodejs'

// GET - Récupérer tous les événements (public) ou filtrés
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const location = searchParams.get('location')
    const organizerId = searchParams.get('organizer_id')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'date'
    const verified = searchParams.get('verified')

    const where: any = {}
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.event_date = {
        gte: startDate,
        lt: endDate,
      }
    }
    if (location) {
      where.location = { contains: location }
    }
    if (organizerId) {
      where.organizer_id = parseInt(organizerId)
    }
    if (category) {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    }
    if (verified === 'true') {
      where.verified = true
    }

    // Système de tri
    let orderBy: any = {}
    switch (sort) {
      case 'price_asc':
        // Tri par prix croissant (nécessite une jointure avec tickets)
        orderBy = { event_date: 'asc' }
        break
      case 'price_desc':
        orderBy = { event_date: 'asc' }
        break
      case 'date':
        orderBy = { event_date: 'asc' }
        break
      case 'date_desc':
        orderBy = { event_date: 'desc' }
        break
      case 'popular':
        orderBy = { likes: 'desc' }
        break
      case 'views':
        orderBy = { views: 'desc' }
        break
      default:
        orderBy = { event_date: 'asc' }
    }

    const events = await prisma.events.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        tickets: true,
      },
      orderBy,
    })

    // Tri par prix côté serveur si nécessaire
    if (sort === 'price_asc' || sort === 'price_desc') {
      events.sort((a, b) => {
        const priceA = Math.min(...(a.tickets.map(t => t.price || 0).filter(p => p > 0) || [Infinity]))
        const priceB = Math.min(...(b.tickets.map(t => t.price || 0).filter(p => p > 0) || [Infinity]))
        return sort === 'price_asc' ? priceA - priceB : priceB - priceA
      })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer les événements' }, { status: 500 })
  }
}

// POST - Créer un nouvel événement (organisateur uniquement)
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const user = await prisma.users.findUnique({ where: { id: userId } })
    if (!user || (user.role !== 'organisateur' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Accès refusé. Organisateur requis.' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, location, event_date, image, category, tickets } = body

    const event = await prisma.events.create({
      data: {
        title,
        description,
        location,
        event_date: new Date(event_date),
        image,
        category: category || 'autre',
        organizer_id: userId,
        tickets: tickets ? {
          create: tickets.map((t: any) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity,
          }))
        } : undefined,
      },
      include: {
        tickets: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la création de l\'événement' }, { status: 500 })
  }
}

