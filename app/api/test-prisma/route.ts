import { NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured, isPrismaAvailable } from '../../../lib/prisma'

export const runtime = 'nodejs'

// Route de test pour diagnostiquer les problèmes Prisma
export async function GET() {
  const diagnostics: Record<string, any> = {}

  // Vérifier DATABASE_URL
  diagnostics.DATABASE_URL = {
    defined: !!process.env.DATABASE_URL,
    value: process.env.DATABASE_URL ? '***' + process.env.DATABASE_URL.slice(-20) : 'non défini',
  }

  // Vérifier isDatabaseConfigured
  diagnostics.isDatabaseConfigured = isDatabaseConfigured()

  // Vérifier isPrismaAvailable
  diagnostics.isPrismaAvailable = isPrismaAvailable()

  // Vérifier l'instance Prisma
  diagnostics.prisma = {
    exists: prisma !== null && prisma !== undefined,
    type: typeof prisma,
    hasUser: typeof (prisma as any)?.user !== 'undefined',
  }

  // Tester une opération Prisma si possible
  if (isDatabaseConfigured() && isPrismaAvailable() && prisma) {
    try {
      const userCount = await prisma.user.count()
      diagnostics.databaseOperation = {
        success: true,
        userCount,
      }
    } catch (error) {
      diagnostics.databaseOperation = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  } else {
    diagnostics.databaseOperation = {
      success: false,
      error: 'Prisma non disponible ou DATABASE_URL non configuré',
    }
  }

  return NextResponse.json({
    success: diagnostics.databaseOperation?.success || false,
    diagnostics,
    timestamp: new Date().toISOString(),
  })
}

