# 🔐 Variables d'environnement pour Vercel

Ce document liste **toutes** les variables d'environnement nécessaires pour déployer TchadEvent sur Vercel.

---

## 📋 Variables OBLIGATOIRES

Ces variables sont **essentielles** pour que l'application fonctionne.

### 1. **DATABASE_URL** (Obligatoire)

**Description** : URL de connexion à la base de données MySQL

**Format** : `mysql://user:password@host:port/database`

**Exemple** :
```
DATABASE_URL=mysql://username:password@host.example.com:3306/tchadevent_db
```

**Où l'obtenir** :
- Si vous utilisez **PlanetScale** : Dans votre dashboard PlanetScale → Database → Connect → Connection string
- Si vous utilisez **Railway** : Dans votre projet → MySQL → Connect → Connection URL
- Si vous utilisez **Supabase** : Dans votre projet → Settings → Database → Connection string
- Si vous utilisez votre propre serveur MySQL : Construisez l'URL avec vos identifiants

**⚠️ Important** :
- ✅ Disponible pour **Production**, **Preview** et **Development**
- ✅ Pas d'espaces avant ou après le `=`
- ✅ Pas de guillemets autour de la valeur dans Vercel

---

### 2. **JWT_SECRET** (Obligatoire)

**Description** : Secret utilisé pour signer et vérifier les tokens JWT d'authentification

**Format** : Chaîne aléatoire sécurisée (minimum 32 caractères)

**Exemple** :
```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-and-random
```

**Comment générer** :
```bash
# Sur Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Sur Linux/Mac
openssl rand -base64 32
```

**⚠️ Important** :
- ✅ Disponible pour **Production**, **Preview** et **Development**
- ✅ Gardez ce secret **privé** et ne le partagez jamais
- ✅ Utilisez un secret différent pour chaque environnement si possible

---

### 3. **NEXT_PUBLIC_GOOGLE_CLIENT_ID** (Obligatoire pour OAuth Google)

**Description** : Client ID Google OAuth pour l'authentification avec Google

**Format** : ID client Google (format : `xxxxx-xxxxx.apps.googleusercontent.com`)

**Exemple** :
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```

**Où l'obtenir** :
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **APIs & Services** → **Credentials**
4. Copiez le **Client ID** de votre OAuth 2.0 Client

**⚠️ Important** :
- ✅ Disponible pour **Production**, **Preview** et **Development**
- ✅ Le préfixe `NEXT_PUBLIC_` est **obligatoire** pour que la variable soit accessible côté client
- ✅ Ajoutez votre URL Vercel dans les "Authorized JavaScript origins" et "Authorized redirect URIs" dans Google Cloud Console

---

## 🔧 Variables OPTIONNELLES (Paiements)

Ces variables sont nécessaires uniquement si vous activez les paiements Airtel Money ou Moov Money.

### 4. **NEXT_PUBLIC_AIRTEL_MONEY_ENABLED** (Optionnel)

**Description** : Active ou désactive le paiement Airtel Money

**Format** : `true` ou `false`

**Exemple** :
```
NEXT_PUBLIC_AIRTEL_MONEY_ENABLED=true
```

**⚠️ Important** :
- ✅ Disponible pour **Production**, **Preview** et **Development**
- ✅ Si `false` ou non défini, le bouton Airtel Money sera désactivé

---

### 5. **AIRTEL_MONEY_API_KEY** (Optionnel - Requis si Airtel Money activé)

**Description** : Clé API Airtel Money

**Exemple** :
```
AIRTEL_MONEY_API_KEY=your_airtel_api_key_here
```

---

### 6. **AIRTEL_MONEY_API_SECRET** (Optionnel - Requis si Airtel Money activé)

**Description** : Secret API Airtel Money

**Exemple** :
```
AIRTEL_MONEY_API_SECRET=your_airtel_api_secret_here
```

---

### 7. **AIRTEL_MONEY_MERCHANT_ID** (Optionnel - Requis si Airtel Money activé)

**Description** : ID du marchand Airtel Money

**Exemple** :
```
AIRTEL_MONEY_MERCHANT_ID=your_merchant_id_here
```

---

### 8. **AIRTEL_MONEY_API_URL** (Optionnel)

**Description** : URL de l'API Airtel Money

**Valeur par défaut** : `https://api.airtelmoney.com`

**Exemple** :
```
AIRTEL_MONEY_API_URL=https://api.airtelmoney.com
```

---

### 9. **NEXT_PUBLIC_MOOV_MONEY_ENABLED** (Optionnel)

**Description** : Active ou désactive le paiement Moov Money

**Format** : `true` ou `false`

**Exemple** :
```
NEXT_PUBLIC_MOOV_MONEY_ENABLED=true
```

**⚠️ Important** :
- ✅ Disponible pour **Production**, **Preview** et **Development**
- ✅ Si `false` ou non défini, le bouton Moov Money sera désactivé

---

### 10. **MOOV_MONEY_API_KEY** (Optionnel - Requis si Moov Money activé)

**Description** : Clé API Moov Money

**Exemple** :
```
MOOV_MONEY_API_KEY=your_moov_api_key_here
```

---

### 11. **MOOV_MONEY_API_SECRET** (Optionnel - Requis si Moov Money activé)

**Description** : Secret API Moov Money

**Exemple** :
```
MOOV_MONEY_API_SECRET=your_moov_api_secret_here
```

---

### 12. **MOOV_MONEY_MERCHANT_ID** (Optionnel - Requis si Moov Money activé)

**Description** : ID du marchand Moov Money

**Exemple** :
```
MOOV_MONEY_MERCHANT_ID=your_merchant_id_here
```

---

### 13. **MOOV_MONEY_API_URL** (Optionnel)

**Description** : URL de l'API Moov Money

**Valeur par défaut** : `https://api.moovmoney.com`

**Exemple** :
```
MOOV_MONEY_API_URL=https://api.moovmoney.com
```

---

## 📝 Configuration complète minimale pour Vercel

Voici la configuration **minimale** nécessaire pour que l'application fonctionne :

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NEXT_PUBLIC_GOOGLE_CLIENT_ID=918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```

---

## 📝 Configuration complète avec paiements

Si vous activez les paiements, ajoutez également :

```env
# Airtel Money
NEXT_PUBLIC_AIRTEL_MONEY_ENABLED=true
AIRTEL_MONEY_API_KEY=your_key
AIRTEL_MONEY_API_SECRET=your_secret
AIRTEL_MONEY_MERCHANT_ID=your_merchant_id
AIRTEL_MONEY_API_URL=https://api.airtelmoney.com

# Moov Money
NEXT_PUBLIC_MOOV_MONEY_ENABLED=true
MOOV_MONEY_API_KEY=your_key
MOOV_MONEY_API_SECRET=your_secret
MOOV_MONEY_MERCHANT_ID=your_merchant_id
MOOV_MONEY_API_URL=https://api.moovmoney.com
```

---

## 🚀 Comment ajouter les variables sur Vercel

### Étape 1 : Accéder aux variables d'environnement

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **tchadevent-ofc7**
3. Allez dans **"Settings"** → **"Environment Variables"**

### Étape 2 : Ajouter chaque variable

Pour chaque variable :

1. Cliquez sur **"Add New"**
2. Entrez le **nom** de la variable (ex: `DATABASE_URL`)
3. Entrez la **valeur** de la variable
4. Sélectionnez les environnements :
   - ✅ **Production** (pour les déploiements en production)
   - ✅ **Preview** (pour les preview deployments)
   - ✅ **Development** (pour les déploiements de développement)
5. Cliquez sur **"Save"**

### Étape 3 : Redéployer

Après avoir ajouté toutes les variables :

1. Allez dans **"Deployments"**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Vérifiez que **"Use existing Build Cache"** est **désactivé**
5. Cliquez sur **"Redeploy"**

---

## ✅ Checklist de configuration

Avant de déployer, vérifiez que vous avez :

- [ ] **DATABASE_URL** configuré avec une base de données MySQL accessible depuis Internet
- [ ] **JWT_SECRET** généré et configuré (minimum 32 caractères)
- [ ] **NEXT_PUBLIC_GOOGLE_CLIENT_ID** configuré avec votre Client ID Google
- [ ] URL Vercel ajoutée dans Google Cloud Console (Authorized JavaScript origins et Authorized redirect URIs)
- [ ] Toutes les variables marquées pour **Production**, **Preview** et **Development**
- [ ] Base de données créée et migrations Prisma appliquées
- [ ] Compte admin créé (utilisez `npm run create-admin` en local, puis importez les données)

---

## 🔍 Vérification après déploiement

Après le déploiement, testez ces routes pour vérifier que tout fonctionne :

1. **Test Prisma** : `https://votre-app.vercel.app/api/test-prisma`
   - Devrait retourner `"success": true`

2. **Test OAuth** : `https://votre-app.vercel.app/api/test-oauth`
   - Devrait retourner les variables configurées

3. **Page d'accueil** : `https://votre-app.vercel.app/`
   - Devrait s'afficher sans erreur

4. **Connexion Google** : `https://votre-app.vercel.app/login`
   - Le bouton Google devrait être visible et fonctionnel

---

## ⚠️ Notes importantes

1. **Sécurité** :
   - Ne partagez **jamais** vos variables d'environnement
   - Ne commitez **jamais** les variables dans Git
   - Utilisez des secrets différents pour chaque environnement si possible

2. **Base de données** :
   - Assurez-vous que votre base de données MySQL est accessible depuis Internet
   - Vérifiez que le firewall autorise les connexions depuis Vercel
   - Utilisez SSL si possible (ajoutez `?sslaccept=strict` à votre DATABASE_URL)

3. **Google OAuth** :
   - Ajoutez **toutes** vos URLs Vercel dans Google Cloud Console :
     - `https://votre-app.vercel.app`
     - `https://votre-app-*.vercel.app` (pour les preview deployments)

4. **Redéploiement** :
   - Après avoir ajouté/modifié des variables, **redéployez** toujours l'application
   - Les variables sont injectées au moment du build, pas à l'exécution

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs Vercel dans **"Deployments"** → **"Runtime Logs"**
2. Testez les routes de diagnostic (`/api/test-prisma`, `/api/test-oauth`)
3. Vérifiez que toutes les variables sont bien configurées dans Vercel

---

**Dernière mise à jour** : Décembre 2024

