# 🔐 Configuration de l'authentification Google OAuth

Ce guide explique comment configurer l'authentification OAuth avec Google pour TchadEvent.

## 📋 Prérequis

1. Un compte Google Cloud Console
2. Accès aux variables d'environnement du projet

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
     - Votre URL de production (ex: `https://tchadevent.com`)
   - **Authorized redirect URIs** :
     - `http://localhost:3000` (développement)
     - Votre URL de production (ex: `https://tchadevent.com`)

### 4. Récupérer le Client ID

1. Après création, vous verrez votre **Client ID** (commence généralement par quelque chose comme `123456789-abcdefg.apps.googleusercontent.com`)
2. **IMPORTANT** : Vous verrez aussi un **Client Secret** (commence par `GOCSPX-...`), mais **vous n'en avez PAS besoin** pour cette implémentation côté client
3. Copiez uniquement le **Client ID**

### 5. Ajouter la variable d'environnement

Ajoutez dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id_google
```

**Exemple** :
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## 🚀 Test de l'authentification

1. Démarrez votre application : `npm run dev`
2. Allez sur la page de connexion (`http://localhost:3000/login`)
3. Cliquez sur le bouton **"Continuer avec Google"**
4. Sélectionnez votre compte Google
5. Autorisez l'application
6. Vous devriez être redirigé et connecté automatiquement

## ⚠️ Notes importantes

### Différence entre Client ID et Client Secret

- **Client ID** : Public, peut être exposé côté client (dans le code JavaScript)
- **Client Secret** : Privé, ne doit JAMAIS être exposé côté client

Pour cette implémentation, nous utilisons uniquement le **Client ID** côté client. Le token d'accès est vérifié côté serveur via l'API Google.

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
- L'avatar et le nom sont mis à jour automatiquement depuis Google

## 🔧 Dépannage

### Google SDK ne se charge pas

- Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est défini dans `.env.local`
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que les origines JavaScript sont correctement configurées dans Google Cloud Console
- Assurez-vous que l'API Google+ est activée

### Erreur "Token invalide"

- Vérifiez que les tokens sont bien transmis
- Vérifiez que les URLs de redirection sont correctes dans Google Cloud Console
- Assurez-vous que les scopes sont correctement configurés

### Erreur "popup blocked"

- Vérifiez que les popups ne sont pas bloquées dans votre navigateur
- Assurez-vous que vous testez sur `localhost` ou un domaine autorisé

## 📚 Ressources

- [Documentation Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Platform](https://developers.google.com/identity)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

