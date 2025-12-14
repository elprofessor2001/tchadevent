import { NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured } from '../../../../lib/prisma'
import { hashPassword, generateToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // Vérifier les variables d'environnement
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: 'Erreur serveur', details: 'DATABASE_URL manquant' },
        { status: 500 }
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Erreur serveur', details: 'JWT_SECRET manquant' },
        { status: 500 }
      )
    }

    // Lire le body
    const body = await req.json()
    const { email, password, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mot de passe trop court (min 6 caractères)' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 🔥 CORRECT : prisma.user (singulier)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email déjà utilisé' },
        { status: 400 }
      )
    }

    // Sécurité : empêcher admin
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Inscription admin interdite' },
        { status: 403 }
      )
    }

    const allowedRoles = ['client', 'organisateur']
    const finalRole = allowedRoles.includes(role) ? role : 'client'

    const hashedPassword = await hashPassword(password)

    // 🔥 CORRECT : prisma.user.create
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: finalRole,
      },
    })

    const token = generateToken(newUser.id)

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('REGISTER ERROR:', error)

    return NextResponse.json(
      {
        error: 'Erreur lors de l’inscription',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}
