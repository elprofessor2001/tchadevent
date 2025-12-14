# 🔑 Comment obtenir votre Client ID Google

## ⚠️ Important

Ce que vous avez fourni (`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`) est un **Client Secret**, pas un **Client ID**.

Pour l'authentification OAuth côté client, nous avons besoin du **Client ID**, pas du Client Secret.

## 📍 Où trouver votre Client ID

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **"APIs & Services"** → **"Credentials"**
4. Cherchez votre **OAuth 2.0 Client ID** (pas le Client Secret)
5. Le Client ID ressemble à ceci : `123456789-abcdefghijklmnop.apps.googleusercontent.com`

## 🔍 Différence entre Client ID et Client Secret

- **Client ID** : Public, peut être exposé dans le code JavaScript (c'est ce dont nous avons besoin)
- **Client Secret** : Privé, ne doit JAMAIS être exposé côté client (c'est ce que vous avez fourni)

## ✅ Ce qu'il faut faire

1. Copiez votre **Client ID** (pas le Secret)
2. Ajoutez-le dans votre fichier `.env.local` :
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id_ici
   ```
3. Redémarrez votre serveur de développement

## 📝 Exemple

Si votre Client ID est `123456789-abcdefghijklmnop.apps.googleusercontent.com`, votre `.env.local` devrait contenir :

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## 🚀 Après configuration

Une fois le Client ID configuré, le bouton "Continuer avec Google" sur la page de connexion fonctionnera automatiquement.

