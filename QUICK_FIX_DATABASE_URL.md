# ⚡ Solution rapide : Erreur DATABASE_URL

## 🔴 Problème actuel

```
Erreur de configuration serveur (Client Prisma non disponible. Vérifiez DATABASE_URL.)
```

## ✅ Solution en 3 étapes

### Étape 1 : Vérifier le fichier .env.local

Ouvrez le fichier `.env.local` à la racine du projet et vérifiez qu'il contient :

```env
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com"
```

**⚠️ IMPORTANT** :
- Remplacez `root` par votre utilisateur MySQL si différent
- Remplacez le mot de passe après `:` si vous en avez un
- Remplacez `tchadevent_db` par le nom de votre base de données

**Exemple si vous avez un mot de passe** :
```env
DATABASE_URL="mysql://root:monmotdepasse@localhost:3306/tchadevent_db"
```

### Étape 2 : Créer la base de données (si elle n'existe pas)

Ouvrez un terminal et exécutez :

```bash
mysql -u root -p
```

Puis dans MySQL :

```sql
CREATE DATABASE IF NOT EXISTS tchadevent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Étape 3 : REDÉMARRER le serveur

**C'EST CRUCIAL** : Next.js ne recharge pas les variables d'environnement à chaud.

1. **Arrêtez** le serveur (Ctrl+C dans le terminal où `npm run dev` tourne)
2. **Redémarrez** :
   ```bash
   npm run dev
   ```

### Étape 4 : Tester

1. Visitez : `http://localhost:3000/api/test-prisma`
2. Vous devriez voir `"success": true`
3. Essayez de créer un compte : `http://localhost:3000/register`

---

## 🧪 Test rapide

Si après redémarrage ça ne fonctionne toujours pas, testez cette route :

```
http://localhost:3000/api/test-prisma
```

Regardez la valeur de `diagnostics.DATABASE_URL.defined` :
- Si `false` → Le fichier `.env.local` n'est pas chargé ou `DATABASE_URL` n'est pas défini
- Si `true` → Le problème vient de la connexion à la base de données

---

## 📝 Format DATABASE_URL correct

**Format** : `mysql://user:password@host:port/database`

**Exemples valides** :
```env
# Sans mot de passe
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"

# Avec mot de passe
DATABASE_URL="mysql://root:monmotdepasse@localhost:3306/tchadevent_db"

# Utilisateur différent
DATABASE_URL="mysql://monuser:monmotdepasse@localhost:3306/tchadevent_db"
```

**⚠️ Erreurs courantes** :
```env
# ❌ MAUVAIS - Espaces autour du =
DATABASE_URL = "mysql://..."

# ❌ MAUVAIS - Oubli des deux-points après root
DATABASE_URL="mysql://root@localhost:3306/tchadevent_db"

# ✅ BON
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"
```

---

## 🚨 Si ça ne fonctionne toujours pas

1. Vérifiez que MySQL est démarré
2. Vérifiez que vous pouvez vous connecter manuellement :
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```
3. Vérifiez les logs du serveur Next.js pour voir les erreurs exactes
4. Testez la route `/api/test-prisma` et partagez le résultat

