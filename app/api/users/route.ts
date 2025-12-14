import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/auth'

export const runtime = 'nodejs'

// GET - Récupérer tous les utilisateurs (admin uniquement)
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token) as any
    const userId = decoded.userId

    // Vérifier que l'utilisateur est admin
    const user = await prisma.users.findUnique({ where: { id: userId } })
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé. Admin uniquement.' }, { status: 403 })
    }

    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer les utilisateurs' }, { status: 500 })
  }
}
