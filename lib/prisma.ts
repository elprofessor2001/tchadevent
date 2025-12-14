// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fonction pour créer une instance Prisma
function createPrismaClient(): PrismaClient {
  // Vérifier que DATABASE_URL est défini
  if (!process.env.DATABASE_URL) {
    console.error('⚠️ DATABASE_URL is not defined. Prisma operations will fail.')
    // Créer quand même une instance Prisma, mais elle échouera lors de la première opération
    // Cela permet aux routes de gérer l'erreur proprement
  }

  try {
    // Pour Prisma 5, on peut utiliser new PrismaClient() seul
    // Prisma lit automatiquement DATABASE_URL depuis .env
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    return client
  } catch (error) {
    console.error('❌ Error creating Prisma client:', error)
    // Si la création échoue, on crée quand même une instance vide
    // Les routes devront vérifier isDatabaseConfigured() avant d'utiliser prisma
    return new PrismaClient()
  }
}

// Export avec singleton pattern
// S'assurer que prisma n'est jamais undefined
const prismaInstance = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

// Export avec vérification
export const prisma: PrismaClient = prismaInstance

// Fonction helper pour vérifier si DATABASE_URL est défini
export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}

// Fonction helper pour vérifier si Prisma est disponible
export function isPrismaAvailable(): boolean {
  return prisma !== null && prisma !== undefined
}
