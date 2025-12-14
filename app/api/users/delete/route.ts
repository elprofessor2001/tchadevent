import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

// DELETE - Supprimer un utilisateur (admin uniquement)
export async function DELETE(req: Request) {
  try {
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
      return NextResponse.json({ error: 'Seul un administrateur peut supprimer des utilisateurs' }, { status: 403 })
    }

    const body = await req.json()
    const { userId: targetUserId } = body

    if (!targetUserId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 })
    }

    // SÉCURITÉ : Empêcher un admin de se supprimer lui-même
    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Vous ne pouvez pas vous supprimer vous-même' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // SÉCURITÉ : Empêcher la suppression d'un autre admin
    if (targetUser.role === 'admin') {
      return NextResponse.json({ 
        error: 'Vous ne pouvez pas supprimer un autre administrateur. Rétrogradez-le d\'abord.' 
      }, { status: 400 })
    }

    await prisma.user.delete({ where: { id: targetUserId } })

    return NextResponse.json({ 
      success: true, 
      message: 'Utilisateur supprimé avec succès' 
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

