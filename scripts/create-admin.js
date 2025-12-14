const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔐 Création/Mise à jour du compte administrateur...')
    console.log('')

    const adminEmail = 'contact@tchadevent.td'
    const adminPassword = 'TchadEvent1015'

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    if (existingUser) {
      console.log('📧 Utilisateur trouvé:', existingUser.email)
      console.log('   Rôle actuel:', existingUser.role)
      console.log('🔄 Mise à jour en administrateur...')
      
      // Mettre à jour l'utilisateur existant
      const admin = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: 'admin',
          password: hashedPassword, // Réinitialiser le mot de passe
          name: existingUser.name || 'Administrateur TchadEvent',
          verified: true,
        },
      })

      console.log('✅ Administrateur mis à jour avec succès!')
      console.log('📧 Email:', admin.email)
      console.log('🔑 Mot de passe:', adminPassword)
      console.log('👤 Rôle: admin')
    } else {
      console.log('➕ Création d\'un nouvel administrateur...')
      
      // Créer l'admin
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
          name: 'Administrateur TchadEvent',
          verified: true,
        },
      })

      console.log('✅ Administrateur créé avec succès!')
      console.log('📧 Email:', admin.email)
      console.log('🔑 Mot de passe:', adminPassword)
      console.log('👤 Rôle: admin')
    }

    console.log('')
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion!')
    console.log('')
    console.log('🔗 Connectez-vous à: http://localhost:3000/login')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error('   Détails:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

