import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyPassword, generateToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (!user.password) {
      console.error('User password is null for email:', email)
      return NextResponse.json({ error: 'Compte invalide. Veuillez vous réinscrire.' }, { status: 401 })
    }

    const validPassword = await verifyPassword(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 })
    }

    const token = generateToken(user.id)
    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role }, token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la connexion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
