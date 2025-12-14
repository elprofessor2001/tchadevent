import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// Route pour vérifier si un email existe déjà
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    })

    return NextResponse.json({
      exists: !!user,
      user: user || null,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 })
  }
}

