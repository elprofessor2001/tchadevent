import { NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured } from '../../../../lib/prisma'
import { generateToken } from '../../../../lib/auth'

export const runtime = 'nodejs'

interface OAuthUser {
  id: string
  email: string
  name?: string
  picture?: string
}

// POST - Authentification OAuth (Facebook ou Google)
export async function POST(req: Request) {
  try {
    // Vérifier les variables d'environnement critiques
    if (!process.env.DATABASE_URL) {
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

    const { provider, accessToken, userInfo } = body

    if (!provider || !accessToken) {
      return NextResponse.json(
        { error: 'Provider et accessToken requis' },
        { status: 400 }
      )
    }

    if (provider !== 'google') {
      return NextResponse.json(
        { error: 'Provider non supporté' },
        { status: 400 }
      )
    }

    // Vérifier le token avec Google
    let verifiedUser: OAuthUser | null = null

    if (provider === 'google') {
      try {
        const googleRes = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          }
        )

        if (!googleRes.ok) {
          const errorText = await googleRes.text()
          console.error('Google API error:', {
            status: googleRes.status,
            statusText: googleRes.statusText,
            body: errorText,
          })
          return NextResponse.json(
            { error: 'Token Google invalide', details: `Status: ${googleRes.status}` },
            { status: 401 }
          )
        }

        const googleUser = await googleRes.json()

        // Valider les données reçues de Google
        if (!googleUser.email) {
          console.error('Google user missing email:', googleUser)
          return NextResponse.json(
            { error: 'Impossible de récupérer l\'email depuis Google' },
            { status: 400 }
          )
        }

        verifiedUser = {
          id: googleUser.id || userInfo?.id || '',
          email: googleUser.email,
          name: googleUser.name || userInfo?.name || null,
          picture: googleUser.picture || userInfo?.picture || null,
        }
      } catch (error) {
        console.error('Google verification error:', error)
        return NextResponse.json(
          {
            error: 'Erreur de vérification Google',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 }
        )
      }
    }

    if (!verifiedUser || !verifiedUser.email) {
      return NextResponse.json(
        { error: 'Impossible de récupérer les informations utilisateur' },
        { status: 400 }
      )
    }

    // Normaliser l'email (lowercase, trim)
    const normalizedEmail = verifiedUser.email.toLowerCase().trim()

    // Vérifier que la base de données est configurée
    if (!isDatabaseConfigured()) {
      console.error('DATABASE_URL is missing')
      return NextResponse.json(
        {
          error: 'Erreur de configuration serveur',
          details: 'Base de données non configurée (DATABASE_URL manquant)',
        },
        { status: 500 }
      )
    }

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

    // Chercher l'utilisateur par email ou créer un nouveau
    let user
    try {
      user = await userModel.findUnique({
        where: { email: normalizedEmail },
      })

      if (!user) {
        // Créer un nouvel utilisateur
        user = await userModel.create({
          data: {
            email: normalizedEmail,
            name: verifiedUser.name && verifiedUser.name.trim() ? verifiedUser.name.trim() : null,
            avatar: verifiedUser.picture && verifiedUser.picture.trim() ? verifiedUser.picture.trim() : null,
            password: null, // Pas de mot de passe pour les comptes OAuth
            role: 'client',
          },
        })
      } else {
        // Mettre à jour l'avatar et le nom si nécessaire
        if (verifiedUser.picture && !user.avatar) {
          await userModel.update({
            where: { id: user.id },
            data: {
              avatar: verifiedUser.picture.trim(),
              name: verifiedUser.name && verifiedUser.name.trim() ? verifiedUser.name.trim() : user.name,
            },
          })
          user.avatar = verifiedUser.picture.trim()
          user.name = verifiedUser.name && verifiedUser.name.trim() ? verifiedUser.name.trim() : user.name
        }
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      return NextResponse.json(
        {
          error: 'Erreur lors de l\'accès à la base de données',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error',
        },
        { status: 500 }
      )
    }

    // Générer le token JWT
    try {
      const token = generateToken(user.id)
      
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
        },
        token,
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
    console.error('OAuth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log détaillé pour le débogage
    console.error('OAuth error details:', {
      message: errorMessage,
      stack: errorStack,
      DATABASE_URL: process.env.DATABASE_URL ? 'defined' : 'missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'defined' : 'missing',
    })
    
    // Retourner un message d'erreur plus détaillé pour faciliter le débogage
    const errorResponse: any = {
      error: 'Erreur lors de l\'authentification OAuth',
      details: errorMessage,
    }

    // Ajouter des informations de diagnostic en développement ou si c'est une erreur de configuration
    if (process.env.NODE_ENV === 'development' || errorMessage.includes('DATABASE_URL') || errorMessage.includes('JWT_SECRET')) {
      errorResponse.diagnostics = {
        DATABASE_URL: process.env.DATABASE_URL ? 'defined' : 'missing',
        JWT_SECRET: process.env.JWT_SECRET ? 'defined' : 'missing',
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      }
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

