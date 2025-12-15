# 🔧 Configuration du fichier .env.local

## ❌ Problème

L'erreur "Client Prisma non disponible. Vérifiez DATABASE_URL." indique que le fichier `.env.local` n'existe pas ou que `DATABASE_URL` n'est pas défini.

---

## ✅ Solution : Créer le fichier .env.local

### Étape 1 : Vérifier si le fichier existe

Le fichier `.env.local` doit être à la **racine du projet** (même niveau que `package.json`).

### Étape 2 : Créer le fichier .env.local

Créez un fichier nommé `.env.local` à la racine du projet avec ce contenu :

```env
# Base de données MySQL
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"

# JWT Secret (générez un secret aléatoire)
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire-changez-moi"

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID="918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com"
```

### Étape 3 : Personnaliser DATABASE_URL

Remplacez les valeurs dans `DATABASE_URL` selon votre configuration MySQL :

**Format** : `mysql://user:password@host:port/database`

**Exemples** :

```env
# Si vous avez un mot de passe MySQL
DATABASE_URL="mysql://root:monmotdepasse@localhost:3306/tchadevent_db"

# Si vous n'avez pas de mot de passe (comme dans l'exemple)
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"

# Si votre MySQL est sur un autre port
DATABASE_URL="mysql://root:@localhost:3307/tchadevent_db"

# Si vous utilisez un utilisateur différent
DATABASE_URL="mysql://monuser:monmotdepasse@localhost:3306/tchadevent_db"
```

### Étape 4 : Générer un JWT_SECRET

Générez un secret JWT sécurisé :

**Sur Windows (PowerShell)** :
```powershell
# Option 1 : Utiliser OpenSSL (si installé)
openssl rand -base64 32

# Option 2 : Utiliser Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Sur Linux/Mac** :
```bash
openssl rand -base64 32
```

Remplacez `votre-secret-jwt-tres-securise-et-aleatoire-changez-moi` par le secret généré.

### Étape 5 : Vérifier que la base de données existe

Assurez-vous que votre base de données MySQL existe :

```sql
-- Connectez-vous à MySQL
mysql -u root -p

-- Créez la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS tchadevent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vérifiez qu'elle existe
SHOW DATABASES;
```

### Étape 6 : Redémarrer le serveur

**IMPORTANT** : Après avoir créé ou modifié `.env.local`, vous **DEVEZ** redémarrer le serveur de développement :

1. Arrêtez le serveur (Ctrl+C dans le terminal)
2. Redémarrez-le :
   ```bash
   npm run dev
   ```

Next.js charge les variables d'environnement uniquement au démarrage, donc les modifications ne sont prises en compte qu'après un redémarrage.

---

## 🧪 Tester la configuration

### Test 1 : Route de diagnostic

Visitez cette URL dans votre navigateur :
```
http://localhost:3000/api/test-prisma
```

Vous devriez voir quelque chose comme :
```json
{
  "success": true,
  "diagnostics": {
    "DATABASE_URL": {
      "defined": true,
      "value": "***localhost:3306/tchadevent_db"
    },
    "isDatabaseConfigured": true,
    "isPrismaAvailable": true,
    "prisma": {
      "exists": true,
      "type": "object",
      "hasUsers": true
    },
    "databaseOperation": {
      "success": true,
      "userCount": 0
    }
  }
}
```

Si `success: false`, vérifiez les détails dans `diagnostics`.

### Test 2 : Créer le schéma de base de données

Si la base de données est vide, créez les tables :

```bash
npx prisma db push
```

Cette commande crée les tables dans votre base de données MySQL selon le schéma Prisma.

---

## 🔍 Vérifications supplémentaires

### Vérifier que le fichier est bien à la racine

Le fichier `.env.local` doit être ici :
```
tchadevent/
├── .env.local          ← ICI
├── package.json
├── next.config.js
├── prisma/
└── app/
```

### Vérifier le format du fichier

- ✅ Pas d'espaces avant ou après le `=`
- ✅ Utilisez des guillemets autour des valeurs (optionnel mais recommandé)
- ✅ Pas de ligne vide avec des espaces
- ✅ Chaque variable sur une nouvelle ligne

**Bon format** :
```env
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"
JWT_SECRET="mon-secret"
```

**Mauvais format** :
```env
DATABASE_URL = "mysql://root:@localhost:3306/tchadevent_db"  ← Espaces autour du =
DATABASE_URL=mysql://root:@localhost:3306/tchadevent_db      ← Pas de guillemets (peut fonctionner mais moins sûr)
```

---

## 🚨 Problèmes courants

### Le fichier .env.local n'est pas chargé

**Solution** :
1. Vérifiez que le fichier s'appelle exactement `.env.local` (avec le point au début)
2. Vérifiez qu'il est à la racine du projet
3. Redémarrez le serveur (`npm run dev`)

### DATABASE_URL est défini mais Prisma ne se connecte pas

**Solutions** :
1. Vérifiez que MySQL est démarré
2. Vérifiez que la base de données existe
3. Vérifiez les identifiants (user, password)
4. Testez la connexion manuellement :
   ```bash
   mysql -u root -p -e "USE tchadevent_db; SHOW TABLES;"
   ```

### Erreur "Access denied"

**Solution** : Vérifiez que l'utilisateur MySQL a les permissions nécessaires :
```sql
GRANT ALL PRIVILEGES ON tchadevent_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📝 Checklist

- [ ] Fichier `.env.local` créé à la racine du projet
- [ ] `DATABASE_URL` défini avec les bonnes valeurs
- [ ] `JWT_SECRET` défini avec un secret aléatoire
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` défini
- [ ] Base de données MySQL créée
- [ ] Serveur redémarré après modification
- [ ] Route `/api/test-prisma` retourne `success: true`
- [ ] Tables créées avec `npx prisma db push`

---

## 🎯 Après configuration

Une fois que tout est configuré :

1. Testez l'inscription : `http://localhost:3000/register`
2. Testez la connexion : `http://localhost:3000/login`
3. Testez OAuth Google : Cliquez sur "Continuer avec Google"

Tout devrait fonctionner maintenant ! 🎉

