const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔐 Création du compte administrateur...')

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.users.findFirst({
      where: { role: 'admin' },
    })

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà:', existingAdmin.email)
      console.log('   Si vous voulez créer un nouveau admin, vous devez d\'abord rétrograder l\'admin existant.')
      process.exit(1)
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { email: 'contact@tchadevent.td' },
    })

    if (existingUser) {
      console.log('⚠️  Un utilisateur avec cet email existe déjà:', existingUser.email)
      console.log('   Rôle actuel:', existingUser.role)
      
      if (existingUser.role === 'admin') {
        console.log('✅ Cet utilisateur est déjà administrateur.')
        process.exit(0)
      } else {
        console.log('🔄 Mise à jour du rôle en administrateur...')
        await prisma.users.update({
          where: { id: existingUser.id },
          data: { role: 'admin' },
        })
        console.log('✅ Rôle mis à jour avec succès!')
        process.exit(0)
      }
    }

    // Hasher le mot de passe (même méthode que dans lib/auth.ts)
    const hashedPassword = await bcrypt.hash('TchadEvent1015', 10)

    // Créer l'admin
    const admin = await prisma.users.create({
      data: {
        email: 'contact@tchadevent.td',
        password: hashedPassword,
        role: 'admin',
        name: 'Administrateur TchadEvent',
        verified: true,
      },
    })

    console.log('✅ Administrateur créé avec succès!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mot de passe: TchadEvent1015')
    console.log('👤 Rôle: admin')
    console.log('')
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

