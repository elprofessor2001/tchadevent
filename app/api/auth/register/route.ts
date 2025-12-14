import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { hashPassword, generateToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 })
    }

    // SÉCURITÉ : Empêcher l'inscription directe en tant qu'admin
    if (role === 'admin') {
      return NextResponse.json({ 
        error: 'Impossible de s\'inscrire en tant qu\'administrateur. Contactez un administrateur existant.' 
      }, { status: 403 })
    }

    // Valider le rôle (seulement 'client' ou 'organisateur' autorisés)
    const allowedRoles = ['client', 'organisateur']
    const finalRole = allowedRoles.includes(role || '') ? role : 'client'

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        role: finalRole as 'client' | 'organisateur',
      },
    })

    const token = generateToken(newUser.id)
    return NextResponse.json({ user: { id: newUser.id, email: newUser.email, role: newUser.role }, token })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'inscription',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
