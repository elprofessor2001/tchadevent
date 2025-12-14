import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

// GET - Récupérer un utilisateur spécifique
export async function GET(
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
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        created_at: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json(targetUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}

// PUT - Modifier un utilisateur (changer le rôle)
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

    // Vérifier que l'utilisateur est admin
    const adminUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Seul un administrateur peut modifier les rôles' }, { status: 403 })
    }

    const body = await req.json()
    const { role } = body

    // Valider le rôle
    const validRoles = ['client', 'organisateur', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    const targetUserId = parseInt(id)

    // SÉCURITÉ : Vérifier qu'il n'y a qu'un seul admin
    if (role === 'admin') {
      // Vérifier s'il y a déjà un admin
      const existingAdmin = await prisma.user.findFirst({
        where: {
          role: 'admin',
          id: { not: targetUserId }, // Exclure l'utilisateur actuel
        },
      })

      if (existingAdmin) {
        return NextResponse.json({
          error: 'Il ne peut y avoir qu\'un seul administrateur. Rétrogradez d\'abord l\'administrateur actuel.',
        }, { status: 400 })
      }
    }

    // SÉCURITÉ : Empêcher un admin de se supprimer lui-même
    if (targetUserId === userId && role !== 'admin') {
      return NextResponse.json({
        error: 'Vous ne pouvez pas vous rétrograder vous-même. Promouvez d\'abord un autre utilisateur en administrateur.',
      }, { status: 400 })
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: role as 'client' | 'organisateur' | 'admin' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        created_at: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

