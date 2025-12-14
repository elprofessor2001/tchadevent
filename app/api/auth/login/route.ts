import { NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured } from '../../../../lib/prisma'
import { verifyPassword, generateToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // Vérifier les variables d'environnement critiques
    if (!isDatabaseConfigured()) {
      console.error('DATABASE_URL is not defined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'DATABASE_URL manquant' },
        { status: 500 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return NextResponse.json(
        { error: 'Erreur de configuration serveur', details: 'JWT_SECRET manquant' },
        { status: 500 }
      )
    }

    // Parser le body avec gestion d'erreur
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Requête invalide', details: 'Impossible de parser le body' },
        { status: 400 }
      )
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    // Normaliser l'email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Vérifier que Prisma est disponible
    const userModel = (prisma as any).user || (prisma as any).users
    if (!prisma || !userModel) {
      console.error('Prisma client is not available')
      return NextResponse.json(
        {
          error: 'Erreur de configuration serveur',
          details: 'Client Prisma non disponible. Vérifiez DATABASE_URL.',
        },
        { status: 500 }
      )
    }

    const user = await userModel.findUnique({ where: { email: normalizedEmail } })
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    if (!user.password) {
      console.error('User password is null for email:', normalizedEmail)
      return NextResponse.json({ error: 'Compte invalide. Veuillez vous réinscrire.' }, { status: 401 })
    }

    const validPassword = await verifyPassword(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    // Générer le token JWT
    try {
      const token = generateToken(user.id)
      return NextResponse.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        }, 
        token 
      })
    } catch (tokenError) {
      console.error('Token generation error:', tokenError)
      return NextResponse.json(
        {
          error: 'Erreur lors de la génération du token',
          details: tokenError instanceof Error ? tokenError.message : 'Unknown token error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log détaillé pour le débogage
    console.error('Login error details:', {
      message: errorMessage,
      stack: errorStack,
    })
    
    return NextResponse.json(
      {
        error: 'Erreur lors de la connexion',
        details: errorMessage,
        // Ne pas exposer la stack en production, mais utile pour le débogage
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      },
      { status: 500 }
    )
  }
}
