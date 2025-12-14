// Script de test pour diagnostiquer les problèmes d'authentification
require('dotenv').config();

async function testAuth() {
  console.log('🔍 Diagnostic de l\'authentification\n');
  
  // 1. Vérifier JWT_SECRET
  console.log('1. Vérification JWT_SECRET:');
  if (process.env.JWT_SECRET) {
    console.log('   ✅ JWT_SECRET est défini');
  } else {
    console.log('   ❌ JWT_SECRET n\'est PAS défini dans .env');
    console.log('   💡 Ajoutez: JWT_SECRET="votre-secret-jwt-tres-securise"');
  }
  
  // 2. Vérifier DATABASE_URL
  console.log('\n2. Vérification DATABASE_URL:');
  if (process.env.DATABASE_URL) {
    console.log('   ✅ DATABASE_URL est défini');
  } else {
    console.log('   ❌ DATABASE_URL n\'est PAS défini');
  }
  
  // 3. Tester l'inscription
  console.log('\n3. Test d\'inscription:');
  try {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'test123456';
    
    const registerRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: 'client'
      }),
    });
    
    const registerData = await registerRes.json();
    
    if (registerRes.ok) {
      console.log('   ✅ Inscription réussie');
      console.log('   User:', registerData.user);
      console.log('   Token:', registerData.token ? 'Généré ✅' : 'Manquant ❌');
      
      // 4. Tester la connexion
      console.log('\n4. Test de connexion:');
      const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      
      const loginData = await loginRes.json();
      
      if (loginRes.ok) {
        console.log('   ✅ Connexion réussie');
        console.log('   User:', loginData.user);
        console.log('   Token:', loginData.token ? 'Généré ✅' : 'Manquant ❌');
      } else {
        console.log('   ❌ Connexion échouée');
        console.log('   Erreur:', loginData.error);
      }
    } else {
      console.log('   ❌ Inscription échouée');
      console.log('   Erreur:', registerData.error);
      console.log('   Détails:', registerData);
    }
  } catch (error) {
    console.log('   ❌ Erreur lors du test:', error.message);
    console.log('   💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
  }
  
  // 5. Vérifier les utilisateurs existants
  console.log('\n5. Vérification des utilisateurs existants:');
  try {
    const usersRes = await fetch('http://localhost:3000/api/test-db');
    const usersData = await usersRes.json();
    
    if (usersData.success) {
      console.log(`   ✅ ${usersData.count} utilisateur(s) dans la base`);
      if (usersData.users.length > 0) {
        console.log('   Utilisateurs:');
        usersData.users.forEach(user => {
          console.log(`      - ${user.email} (${user.role}) - Password: ${user.password ? 'Défini ✅' : 'NULL ❌'}`);
        });
      }
    }
  } catch (error) {
    console.log('   ❌ Impossible de récupérer les utilisateurs:', error.message);
  }
}

testAuth();

