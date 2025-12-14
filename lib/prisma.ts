// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fonction pour créer une instance Prisma
function createPrismaClient(): PrismaClient {
  // Vérifier que DATABASE_URL est défini
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not defined. Please check your .env file.'
    )
  }

  // Pour Prisma 5, on peut utiliser new PrismaClient() seul
  // Prisma lit automatiquement DATABASE_URL depuis .env
  return new PrismaClient()
}

// Export avec singleton pattern
export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
