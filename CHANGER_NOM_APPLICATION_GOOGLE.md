# 🏷️ Changer le nom de l'application dans Google OAuth

Le nom "ConvertX" qui s'affiche lors de la connexion Google vient de la configuration dans Google Cloud Console. Voici comment le changer pour "TchadEvent" :

## 📝 Étapes pour changer le nom

### 1. Accéder à l'écran de consentement OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **"APIs & Services"** → **"OAuth consent screen"**

### 2. Modifier les informations de l'application

1. Cliquez sur **"EDIT APP"** (Modifier l'application)
2. Dans la section **"App information"** :
   - **App name** : Changez "ConvertX" en **"TchadEvent"**
   - **User support email** : Votre email de support
   - **App logo** (optionnel) : Vous pouvez uploader le logo de TchadEvent
   - **App domain** (optionnel) : Votre domaine si vous en avez un
   - **Application home page** (optionnel) : URL de votre site
   - **Privacy policy link** (optionnel) : Lien vers votre politique de confidentialité
   - **Terms of service link** (optionnel) : Lien vers vos conditions d'utilisation

3. Cliquez sur **"SAVE AND CONTINUE"**

### 3. Configurer les scopes (si nécessaire)

1. Dans la section **"Scopes"**, vérifiez que vous avez :
   - `email`
   - `profile`
   - `openid`

2. Cliquez sur **"SAVE AND CONTINUE"**

### 4. Ajouter des utilisateurs de test (si en mode test)

1. Si votre application est en mode "Testing", ajoutez votre email dans **"Test users"**
2. Cliquez sur **"SAVE AND CONTINUE"**

### 5. Publier l'application (si nécessaire)

1. Si vous êtes prêt, vous pouvez publier l'application
2. Sinon, gardez-la en mode "Testing" pour le développement

## ✅ Résultat

Après ces modifications, lorsque les utilisateurs se connecteront avec Google, ils verront :
- **"TchadEvent"** au lieu de "ConvertX"
- Votre logo (si vous l'avez ajouté)
- Vos informations de contact

## ⚠️ Notes importantes

- Les changements peuvent prendre quelques minutes à se propager
- Si vous êtes en mode "Testing", seuls les utilisateurs de test verront l'application
- Pour que tous les utilisateurs puissent se connecter, vous devez publier l'application

## 🔄 Vérification

1. Redémarrez votre serveur de développement
2. Allez sur `http://localhost:3000/login`
3. Cliquez sur "Continuer avec Google"
4. Vous devriez maintenant voir "TchadEvent" au lieu de "ConvertX"

