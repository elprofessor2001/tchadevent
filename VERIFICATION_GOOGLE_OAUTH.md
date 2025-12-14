# 🔍 Vérification de la configuration Google OAuth

Si vous rencontrez l'erreur "Impossible de poursuivre avec google.com", vérifiez les points suivants :

## ✅ 1. Vérifier le Client ID dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **"APIs & Services"** → **"Credentials"**
4. Cliquez sur votre **OAuth 2.0 Client ID**
5. Vérifiez que le Client ID correspond à celui dans votre `.env.local` :
   ```
   918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
   ```

## ✅ 2. Vérifier les URLs autorisées

Dans la configuration de votre OAuth Client ID, vérifiez que vous avez :

### Authorized JavaScript origins
Ajoutez ces URLs (sans slash final) :
```
http://localhost:3000
https://votre-domaine.com
```

### Authorized redirect URIs
Ajoutez ces URLs :
```
http://localhost:3000
https://votre-domaine.com
```

**⚠️ Important** : 
- N'ajoutez PAS de slash final (`/`) à la fin des URLs
- Utilisez `http://` pour localhost (pas `https://`)
- Pour la production, utilisez `https://`

## ✅ 3. Vérifier l'écran de consentement OAuth

1. Allez dans **"APIs & Services"** → **"OAuth consent screen"**
2. Vérifiez que l'écran de consentement est configuré
3. Si vous êtes en mode "Test", ajoutez votre email dans "Test users"

## ✅ 4. Vérifier les scopes

Assurez-vous que les scopes suivants sont activés :
- `email`
- `profile`
- `openid`

## ✅ 5. Vérifier le fichier .env.local

Votre fichier `.env.local` doit contenir :
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```

**⚠️ Important** :
- Pas d'espaces avant ou après le `=`
- Pas de guillemets autour de la valeur
- Redémarrez le serveur après modification

## ✅ 6. Redémarrer le serveur

Après toute modification, redémarrez votre serveur :
```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

## 🔧 Dépannage

### Erreur "redirect_uri_mismatch"
- Vérifiez que `http://localhost:3000` est bien dans "Authorized redirect URIs"
- Vérifiez qu'il n'y a pas de slash final

### Erreur "access_denied"
- Vérifiez que votre email est dans "Test users" si vous êtes en mode test
- Vérifiez que l'écran de consentement est publié ou en mode test

### Le SDK ne se charge pas
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs JavaScript
- Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est bien défini

### Erreur "invalid_client"
- Vérifiez que le Client ID est correct
- Vérifiez qu'il n'y a pas d'espaces ou de caractères invalides

## 📝 Configuration complète recommandée

Dans Google Cloud Console, votre OAuth Client ID devrait avoir :

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000
```

**Scopes:**
- email
- profile
- openid

## 🚀 Test

1. Redémarrez votre serveur
2. Allez sur `http://localhost:3000/login`
3. Cliquez sur "Continuer avec Google"
4. Vous devriez voir la popup Google
5. Sélectionnez votre compte
6. Autorisez l'application
7. Vous devriez être connecté automatiquement

