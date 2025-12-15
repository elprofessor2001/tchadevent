# 🔍 Vérifier les variables d'environnement sur Vercel

## ❌ Problème

L'erreur "Erreur lors de l'authentification OAuth" après avoir sélectionné un compte Google indique généralement un problème avec les variables d'environnement ou la connexion à la base de données sur Vercel.

---

## ✅ Solution : Vérifier toutes les variables d'environnement

### Étape 1 : Accéder aux variables d'environnement sur Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **tchadevent-cdl2**
3. Allez dans **"Settings"** → **"Environment Variables"**

### Étape 2 : Vérifier les variables requises

Assurez-vous que **TOUTES** ces variables sont définies :

#### 1. Base de données MySQL
```
DATABASE_URL=mysql://user:password@host:port/database
```

⚠️ **Important** :
- Remplacez `user`, `password`, `host`, `port`, et `database` par vos vraies valeurs
- Si vous utilisez une base de données distante (PlanetScale, Railway, etc.), utilisez l'URL de connexion fournie
- La variable doit être disponible pour **Production**, **Preview** et **Development**

#### 2. JWT Secret
```
JWT_SECRET=votre-secret-jwt-tres-securise-et-aleatoire
```

⚠️ **Important** :
- Utilisez un secret long et aléatoire (minimum 32 caractères)
- Vous pouvez générer un secret avec : `openssl rand -base64 32`
- La variable doit être disponible pour **Production**, **Preview** et **Development**

#### 3. Google OAuth Client ID
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```

⚠️ **Important** :
- Pas d'espaces avant ou après le `=`
- Pas de guillemets autour de la valeur
- La variable doit être disponible pour **Production**, **Preview** et **Development**

---

## 🔍 Vérifier les logs Vercel

### Étape 1 : Accéder aux logs

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **"Deployments"**
4. Cliquez sur le dernier déploiement
5. Cliquez sur l'onglet **"Functions"** ou **"Logs"**

### Étape 2 : Tester et vérifier les erreurs

1. Essayez de vous connecter avec Google
2. Regardez les logs en temps réel
3. Cherchez les erreurs liées à :
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `Prisma`
   - `Connection error`

---

## 🛠️ Problèmes courants et solutions

### Problème 1 : "DATABASE_URL is not defined"

**Solution** :
- Vérifiez que `DATABASE_URL` est bien définie sur Vercel
- Vérifiez qu'elle est disponible pour **Production**
- Redéployez l'application après avoir ajouté la variable

### Problème 2 : "JWT_SECRET is not defined"

**Solution** :
- Vérifiez que `JWT_SECRET` est bien définie sur Vercel
- Générez un nouveau secret si nécessaire : `openssl rand -base64 32`
- Redéployez l'application

### Problème 3 : "Prisma Client initialization error"

**Solution** :
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que la base de données est accessible depuis Internet (pas seulement localhost)
- Vérifiez que le schéma Prisma est à jour : `npx prisma db push`

### Problème 4 : "Connection timeout" ou "Can't reach database"

**Solution** :
- Vérifiez que votre base de données MySQL est accessible depuis Internet
- Si vous utilisez une base de données locale, vous devez utiliser une base de données cloud (PlanetScale, Railway, etc.)
- Vérifiez les paramètres de firewall de votre base de données

---

## 📝 Checklist complète

- [ ] `DATABASE_URL` est définie sur Vercel
- [ ] `DATABASE_URL` est disponible pour Production
- [ ] `JWT_SECRET` est définie sur Vercel
- [ ] `JWT_SECRET` est disponible pour Production
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est définie sur Vercel
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est disponible pour Production
- [ ] Toutes les variables sont sans espaces ni guillemets
- [ ] Application redéployée après modification des variables
- [ ] Base de données accessible depuis Internet
- [ ] Schéma Prisma à jour (`npx prisma db push`)

---

## 🚀 Redéployer après modification

Après avoir ajouté ou modifié des variables d'environnement :

1. Allez dans **"Deployments"**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **"Redeploy"**

Ou faites un nouveau commit et push vers GitHub.

---

## 🧪 Tester la connexion à la base de données

Créez une route de test temporaire pour vérifier la connexion :

```typescript
// app/api/test-db/route.ts
import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$connect()
    const userCount = await prisma.users.count()
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected',
      userCount 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
```

Visitez `https://tchadevent-cdl2.vercel.app/api/test-db` pour tester.

---

## 📞 Support

Si le problème persiste après avoir vérifié toutes les variables :

1. Vérifiez les logs Vercel pour les erreurs détaillées
2. Vérifiez que votre base de données est accessible
3. Vérifiez que toutes les variables sont correctement formatées

