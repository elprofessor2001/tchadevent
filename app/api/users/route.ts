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
    let decoded: any
    try {
      decoded = verifyToken(token) as any
    } catch (error) {
      console.error('Token invalide:', error)
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 })
    }

    const userId = decoded.userId
    if (!userId) {
      console.error('userId manquant dans le token')
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.error('Utilisateur non trouvé pour userId:', userId)
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    console.log('Utilisateur trouvé:', { id: user.id, email: user.email, role: user.role })

    if (user.role !== 'admin') {
      console.error('Accès refusé - Rôle:', user.role, 'pour userId:', userId)
      return NextResponse.json({ 
        error: 'Accès refusé. Admin uniquement.',
        details: `Rôle actuel: ${user.role}`
      }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Mapper createdAt vers created_at pour la compatibilité avec le frontend
    const usersWithSnakeCase = users.map(user => ({
      ...user,
      created_at: user.createdAt,
    }))
    return NextResponse.json(usersWithSnakeCase)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Impossible de récupérer les utilisateurs' }, { status: 500 })
  }
}
