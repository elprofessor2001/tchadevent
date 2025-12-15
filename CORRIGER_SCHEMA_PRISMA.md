# 🔧 Correction du schéma Prisma

## ❌ Problème identifié

Le schéma Prisma utilisait `postgresql` comme provider alors que vous utilisez MySQL. Cela causait des erreurs de connexion.

## ✅ Corrections apportées

1. **Provider changé** : `postgresql` → `mysql`
2. **Mapping des tables** : Ajout de `@@map()` pour correspondre aux noms de tables MySQL
3. **Types de données** : Ajout d'annotations `@db.*` pour MySQL

## 🚀 Actions à faire maintenant

### Étape 1 : Régénérer le client Prisma

```bash
npx prisma generate
```

Cette commande régénère le client Prisma avec la nouvelle configuration MySQL.

### Étape 2 : Appliquer le schéma à la base de données

```bash
npx prisma db push
```

Cette commande crée/modifie les tables dans votre base de données MySQL selon le nouveau schéma.

**⚠️ ATTENTION** : Si vous avez déjà des données, faites une sauvegarde avant !

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

### Étape 4 : Tester

1. Testez la route de diagnostic : `http://localhost:3000/api/test-prisma`
2. Essayez de créer un compte : `http://localhost:3000/register`

---

## 📝 Changements dans le schéma

### Avant
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Après
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Tables mappées
- `User` → `users`
- `Event` → `events`
- `Ticket` → `tickets`
- `Booking` → `bookings`
- `Follow` → `follows`

---

## 🧪 Vérification

Après avoir exécuté les commandes, vérifiez que :

1. ✅ Le client Prisma est régénéré (pas d'erreurs dans le terminal)
2. ✅ Les tables sont créées dans MySQL
3. ✅ La route `/api/test-prisma` retourne `success: true`
4. ✅ L'inscription fonctionne

---

## 🚨 Si vous avez des erreurs

### Erreur "Table already exists"
Si les tables existent déjà avec l'ancien schéma :
```bash
# Option 1 : Réinitialiser (⚠️ SUPPRIME LES DONNÉES)
npx prisma migrate reset

# Option 2 : Créer une migration
npx prisma migrate dev --name change_to_mysql
```

### Erreur "Cannot connect to database"
Vérifiez que :
- MySQL est démarré (XAMPP)
- `DATABASE_URL` est correct dans `.env.local`
- La base de données existe

---

## ✅ Après correction

Une fois que tout fonctionne, vous devriez pouvoir :
- ✅ Créer un compte
- ✅ Se connecter
- ✅ Utiliser OAuth Google
- ✅ Créer des événements

