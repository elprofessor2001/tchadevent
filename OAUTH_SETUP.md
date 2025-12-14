# 🔐 Configuration de l'authentification OAuth (Facebook & Google)

Ce guide explique comment configurer l'authentification OAuth avec Facebook et Google pour TchadEvent.

## 📋 Prérequis

1. Un compte Facebook Developer
2. Un compte Google Cloud Console
3. Accès aux variables d'environnement du projet

## 🔵 Configuration Facebook

### 1. Créer une application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur **"Mes applications"** → **"Créer une application"**
3. Sélectionnez **"Consommateur"** comme type d'application
4. Remplissez les informations de base

### 2. Configurer Facebook Login

1. Dans votre application, allez dans **"Ajouter un produit"** → **"Connexion Facebook"**
2. Configurez les paramètres :
   - **URL de redirection OAuth valides** : `http://localhost:3000` (développement) et votre domaine de production
   - **URL du site** : Votre URL de production
3. Activez les permissions :
   - `email` (obligatoire)
   - `public_profile` (obligatoire)

### 3. Récupérer les identifiants

1. Allez dans **"Paramètres"** → **"De base"**
2. Notez votre **ID d'application** (App ID)
3. Notez votre **Clé secrète d'application** (App Secret)

### 4. Ajouter les variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_FACEBOOK_APP_ID=votre_app_id_facebook
```

**Note** : La clé secrète n'est pas nécessaire côté client pour cette implémentation.

## 🔴 Configuration Google

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'**API Google+** (si nécessaire)

### 2. Configurer l'écran de consentement OAuth

1. Allez dans **"APIs & Services"** → **"OAuth consent screen"**
2. Choisissez **"Externe"** (ou "Interne" si vous utilisez Google Workspace)
3. Remplissez les informations :
   - **Nom de l'application** : TchadEvent
   - **Email de support** : Votre email
   - **Domaines autorisés** : Votre domaine (optionnel)
4. Ajoutez les scopes :
   - `email`
   - `profile`
   - `openid`

### 3. Créer des identifiants OAuth 2.0

1. Allez dans **"APIs & Services"** → **"Credentials"**
2. Cliquez sur **"Create Credentials"** → **"OAuth client ID"**
3. Sélectionnez **"Web application"**
4. Configurez :
   - **Name** : TchadEvent Web Client
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (développement)
     - Votre URL de production
   - **Authorized redirect URIs** :
     - `http://localhost:3000` (développement)
     - Votre URL de production

### 4. Récupérer les identifiants

1. Après création, notez votre **Client ID**
2. Notez votre **Client Secret** (optionnel pour cette implémentation)

### 5. Ajouter les variables d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id_google
```

## 📝 Variables d'environnement complètes

Votre fichier `.env.local` devrait contenir :

```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/tchadevent"

# JWT
JWT_SECRET="votre_secret_jwt"

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_APP_ID="votre_app_id_facebook"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="votre_client_id_google"
```

## 🚀 Test de l'authentification

### Test Facebook

1. Démarrez votre application : `npm run dev`
2. Allez sur la page de connexion
3. Cliquez sur le bouton **"Facebook"**
4. Autorisez l'application dans la popup Facebook
5. Vous devriez être redirigé et connecté

### Test Google

1. Démarrez votre application : `npm run dev`
2. Allez sur la page de connexion
3. Cliquez sur le bouton **"Google"**
4. Sélectionnez votre compte Google
5. Autorisez l'application
6. Vous devriez être redirigé et connecté

## ⚠️ Notes importantes

### Sécurité

- Les tokens OAuth sont vérifiés côté serveur avant de créer/connecter l'utilisateur
- Les clés secrètes ne sont jamais exposées côté client
- Les tokens d'accès sont utilisés uniquement pour vérifier l'identité, puis jetés

### Production

- Assurez-vous d'ajouter vos domaines de production dans les configurations OAuth
- Utilisez HTTPS en production (requis pour OAuth)
- Configurez les URLs de redirection correctement

### Limitations

- Les utilisateurs OAuth n'ont pas de mot de passe (champ `password` est `null`)
- Si un utilisateur existe déjà avec le même email, il sera connecté (même s'il s'est inscrit avec email/mot de passe)
- L'avatar et le nom sont mis à jour automatiquement depuis le provider OAuth

## 🔧 Dépannage

### Facebook SDK ne se charge pas

- Vérifiez que `NEXT_PUBLIC_FACEBOOK_APP_ID` est défini
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que votre domaine est autorisé dans Facebook

### Google SDK ne se charge pas

- Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est défini
- Vérifiez que les origines JavaScript sont correctement configurées
- Assurez-vous que l'API Google+ est activée

### Erreur "Token invalide"

- Vérifiez que les tokens sont bien transmis
- Vérifiez que les URLs de redirection sont correctes
- Assurez-vous que les scopes sont correctement configurés

## 📚 Ressources

- [Documentation Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Documentation Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

