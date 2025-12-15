# 🔍 Diagnostic de l'erreur 500 OAuth

## ❌ Erreur rencontrée

```
POST https://tchadevent-cdl2.vercel.app/api/auth/oauth 500 (Internal Server Error)
```

## 🔧 Étapes de diagnostic

### Étape 1 : Tester la configuration

J'ai créé une route de test pour vérifier la configuration. Visitez cette URL dans votre navigateur :

```
https://tchadevent-cdl2.vercel.app/api/test-oauth
```

Cette route va vérifier :
- ✅ Si `DATABASE_URL` est défini
- ✅ Si `JWT_SECRET` est défini
- ✅ Si `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est défini
- ✅ Si la connexion à la base de données fonctionne

**Résultat attendu** :
```json
{
  "success": true,
  "checks": {
    "DATABASE_URL": { "status": "ok", "message": "..." },
    "JWT_SECRET": { "status": "ok", "message": "..." },
    "GOOGLE_CLIENT_ID": { "status": "ok", "message": "..." },
    "DATABASE_CONNECTION": { "status": "ok", "message": "..." }
  }
}
```

Si `success: false`, vous verrez quelles variables manquent.

### Étape 2 : Vérifier les logs Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **tchadevent-cdl2**
3. Allez dans **"Deployments"**
4. Cliquez sur le dernier déploiement
5. Cliquez sur l'onglet **"Logs"** ou **"Functions"**
6. Essayez de vous connecter avec Google
7. Regardez les logs en temps réel

Vous devriez voir des messages comme :
- `DATABASE_URL is not defined`
- `JWT_SECRET is not defined`
- `Database operation error: ...`
- `OAuth error details: ...`

### Étape 3 : Vérifier les variables d'environnement sur Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **"Settings"** → **"Environment Variables"**

Vérifiez que ces 3 variables sont définies :

#### ✅ DATABASE_URL
```
mysql://user:password@host:port/database
```
- Doit être disponible pour **Production**, **Preview** et **Development**

#### ✅ JWT_SECRET
```
votre-secret-jwt-tres-securise-et-aleatoire
```
- Minimum 32 caractères
- Doit être disponible pour **Production**, **Preview** et **Development**

#### ✅ NEXT_PUBLIC_GOOGLE_CLIENT_ID
```
918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```
- Pas d'espaces ni de guillemets
- Doit être disponible pour **Production**, **Preview** et **Development**

### Étape 4 : Vérifier la console du navigateur

Après avoir amélioré le code, les erreurs devraient maintenant afficher plus de détails dans la console du navigateur.

1. Ouvrez la console du navigateur (F12)
2. Allez sur l'onglet **"Console"**
3. Essayez de vous connecter avec Google
4. Regardez les messages d'erreur détaillés

Vous devriez voir des messages comme :
```
OAuth API Error: {
  status: 500,
  error: { ... },
  fullResponse: { ... }
}
```

## 🛠️ Solutions selon l'erreur

### Si `DATABASE_URL` est manquant

1. Allez dans Vercel → Settings → Environment Variables
2. Ajoutez `DATABASE_URL` avec votre URL de connexion MySQL
3. Assurez-vous qu'elle est disponible pour **Production**
4. Redéployez l'application

### Si `JWT_SECRET` est manquant

1. Allez dans Vercel → Settings → Environment Variables
2. Ajoutez `JWT_SECRET` avec un secret aléatoire (minimum 32 caractères)
3. Vous pouvez générer un secret avec : `openssl rand -base64 32`
4. Assurez-vous qu'il est disponible pour **Production**
5. Redéployez l'application

### Si la connexion à la base de données échoue

1. Vérifiez que votre `DATABASE_URL` est correcte
2. Vérifiez que votre base de données MySQL est accessible depuis Internet
3. Si vous utilisez une base de données locale, vous devez utiliser une base de données cloud (PlanetScale, Railway, etc.)
4. Vérifiez les paramètres de firewall de votre base de données

### Si l'erreur persiste

1. Consultez les logs Vercel pour le message d'erreur exact
2. Vérifiez que toutes les variables sont correctement formatées (pas d'espaces, pas de guillemets)
3. Redéployez l'application après avoir modifié les variables

## 📝 Améliorations apportées

J'ai amélioré le code pour :

1. ✅ **Vérifier les variables d'environnement** au début de la fonction
2. ✅ **Afficher des messages d'erreur détaillés** dans la console
3. ✅ **Logger les erreurs** avec plus de contexte
4. ✅ **Créer une route de test** pour diagnostiquer les problèmes

## 🚀 Prochaines étapes

1. **Testez la route de diagnostic** : `https://tchadevent-cdl2.vercel.app/api/test-oauth`
2. **Vérifiez les logs Vercel** pour voir l'erreur exacte
3. **Vérifiez les variables d'environnement** sur Vercel
4. **Redéployez** l'application si vous avez modifié des variables
5. **Testez à nouveau** la connexion Google

Les messages d'erreur devraient maintenant être beaucoup plus informatifs et vous indiquer exactement ce qui manque ou ce qui ne fonctionne pas.

