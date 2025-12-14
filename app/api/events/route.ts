import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export const runtime = 'nodejs'

// ===============================
// GET - Récupérer tous les événements
// ===============================
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

    // Filtre par date
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.eventDate = {
        gte: startDate,
        lt: endDate,
      }
    }

    if (location) {
      where.location = { contains: location }
    }

    if (organizerId) {
      where.organizerId = parseInt(organizerId)
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

    // Tri
    let orderBy: any = {}
    switch (sort) {
      case 'price_asc':
      case 'price_desc':
        orderBy = { eventDate: 'asc' } // fallback pour tri par prix
        break
      case 'date':
        orderBy = { eventDate: 'asc' }
        break
      case 'date_desc':
        orderBy = { eventDate: 'desc' }
        break
      case 'popular':
        orderBy = { likes: 'desc' }
        break
      case 'views':
        orderBy = { views: 'desc' }
        break
      default:
        orderBy = { eventDate: 'asc' }
    }

    const events = await prisma.event.findMany({
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
      events.sort((a: any, b: any) => {
        const priceA = Math.min(...(a.tickets.map((t: any) => t.price || 0).filter((p: number) => p > 0) || [Infinity]))
        const priceB = Math.min(...(b.tickets.map((t: any) => t.price || 0).filter((p: number) => p > 0) || [Infinity]))
        return sort === 'price_asc' ? priceA - priceB : priceB - priceA
      })
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json({ error: 'Impossible de récupérer les événements' }, { status: 500 })
  }
}

// ===============================
// POST - Créer un nouvel événement
// ===============================
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || (user.role !== 'organisateur' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Accès refusé. Organisateur requis.' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, location, event_date, image, category, tickets } = body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        eventDate: new Date(event_date), // ✅ camelCase
        image,
        category: category || 'autre',
        organizerId: userId, // ✅ camelCase
        tickets: tickets
          ? {
              create: tickets.map((t: any) => ({
                name: t.name,
                price: t.price,
                quantity: t.quantity,
              })),
            }
          : undefined,
      },
      include: {
        tickets: true,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de l\'événement' }, { status: 500 })
  }
}
