import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
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
    const body = await req.json()
    const { provider, accessToken, userInfo } = body

    if (!provider || !accessToken) {
      return NextResponse.json({ error: 'Provider et accessToken requis' }, { status: 400 })
    }

    if (provider !== 'google') {
      return NextResponse.json({ error: 'Provider non supporté' }, { status: 400 })
    }

    // Vérifier le token avec Google
    let verifiedUser: OAuthUser | null = null

    if (provider === 'google') {
      // Vérifier le token Google
      try {
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
        if (googleRes.ok) {
          const googleUser = await googleRes.json()
          verifiedUser = {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
          }
        } else {
          return NextResponse.json({ error: 'Token Google invalide' }, { status: 401 })
        }
      } catch (error) {
        console.error('Google verification error:', error)
        return NextResponse.json({ error: 'Erreur de vérification Google' }, { status: 500 })
      }
    }

    if (!verifiedUser || !verifiedUser.email) {
      return NextResponse.json({ error: 'Impossible de récupérer les informations utilisateur' }, { status: 400 })
    }

    // Chercher l'utilisateur par email ou créer un nouveau
    let user = await prisma.users.findUnique({
      where: { email: verifiedUser.email },
    })

    if (!user) {
      // Créer un nouvel utilisateur
      user = await prisma.users.create({
        data: {
          email: verifiedUser.email,
          name: verifiedUser.name || null,
          avatar: verifiedUser.picture || null,
          password: null, // Pas de mot de passe pour les comptes OAuth
          role: 'client',
        },
      })
    } else {
      // Mettre à jour l'avatar et le nom si nécessaire
      if (verifiedUser.picture && !user.avatar) {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            avatar: verifiedUser.picture,
            name: verifiedUser.name || user.name,
          },
        })
        user.avatar = verifiedUser.picture
        user.name = verifiedUser.name || user.name
      }
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return NextResponse.json({ error: 'Erreur de configuration serveur' }, { status: 500 })
    }

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
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'authentification OAuth',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

