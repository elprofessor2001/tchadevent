import { NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured } from '../../../lib/prisma'

export const runtime = 'nodejs'

// Route de test pour diagnostiquer les problèmes OAuth
export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error', message: string }> = {}

  // Vérifier DATABASE_URL
  if (!process.env.DATABASE_URL) {
    checks.DATABASE_URL = {
      status: 'error',
      message: 'DATABASE_URL n\'est pas défini'
    }
  } else {
    checks.DATABASE_URL = {
      status: 'ok',
      message: 'DATABASE_URL est défini'
    }
  }

  // Vérifier JWT_SECRET
  if (!process.env.JWT_SECRET) {
    checks.JWT_SECRET = {
      status: 'error',
      message: 'JWT_SECRET n\'est pas défini'
    }
  } else {
    checks.JWT_SECRET = {
      status: 'ok',
      message: 'JWT_SECRET est défini'
    }
  }

  // Vérifier NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    checks.GOOGLE_CLIENT_ID = {
      status: 'error',
      message: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID n\'est pas défini'
    }
  } else {
    checks.GOOGLE_CLIENT_ID = {
      status: 'ok',
      message: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID est défini'
    }
  }

  // Tester la connexion à la base de données
  if (!isDatabaseConfigured()) {
    checks.DATABASE_CONNECTION = {
      status: 'error',
      message: 'DATABASE_URL non configuré'
    }
  } else {
    try {
      await prisma.$connect()
      const userCount = await prisma.user.count()
      checks.DATABASE_CONNECTION = {
        status: 'ok',
        message: `Connexion réussie (${userCount} utilisateurs)`
      }
    } catch (dbError) {
      checks.DATABASE_CONNECTION = {
        status: 'error',
        message: dbError instanceof Error ? dbError.message : 'Erreur de connexion inconnue'
      }
    }
  }

  const hasErrors = Object.values(checks).some(check => check.status === 'error')

  return NextResponse.json({
    success: !hasErrors,
    checks,
    timestamp: new Date().toISOString(),
  })
}

