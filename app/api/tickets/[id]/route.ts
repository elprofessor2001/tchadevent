import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

// PUT - Mettre à jour un billet
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

    const user = await prisma.users.findUnique({ where: { id: userId } })
    const ticket = await prisma.tickets.findUnique({
      where: { id: parseInt(id) },
      include: { event: true },
    })

    if (!ticket || !ticket.event) {
      return NextResponse.json({ error: 'Billet non trouvé' }, { status: 404 })
    }

    if (user?.role !== 'admin' && ticket.event.organizer_id !== userId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await req.json()
    const { name, price, quantity } = body

    const updatedTicket = await prisma.tickets.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price,
        quantity,
      },
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

// DELETE - Supprimer un billet
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

    const user = await prisma.users.findUnique({ where: { id: userId } })
    const ticket = await prisma.tickets.findUnique({
      where: { id: parseInt(id) },
      include: { event: true },
    })

    if (!ticket || !ticket.event) {
      return NextResponse.json({ error: 'Billet non trouvé' }, { status: 404 })
    }

    if (user?.role !== 'admin' && ticket.event.organizer_id !== userId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    await prisma.tickets.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Billet supprimé' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

