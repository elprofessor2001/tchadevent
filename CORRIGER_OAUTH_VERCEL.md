# 🔧 Corriger l'erreur OAuth Google sur Vercel

## ❌ Erreur rencontrée

```
Erreur 400 : redirect_uri_mismatch
```

Cette erreur signifie que l'URL de votre application Vercel n'est pas autorisée dans Google Cloud Console.

---

## ✅ Solution : Ajouter l'URL Vercel dans Google Cloud Console

### Étape 1 : Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **"APIs & Services"** → **"Credentials"**
4. Cliquez sur votre **OAuth 2.0 Client ID** (celui qui commence par `918965473379-...`)

### Étape 2 : Ajouter l'URL Vercel

Dans la section **"Authorized JavaScript origins"**, ajoutez :

```
https://tchadevent-cdl2.vercel.app
```

⚠️ **Important** :
- Utilisez `https://` (pas `http://`)
- N'ajoutez **PAS** de slash final (`/`)
- Pas de chemin après le domaine

Dans la section **"Authorized redirect URIs"**, ajoutez :

```
https://tchadevent-cdl2.vercel.app
```

⚠️ **Important** :
- Utilisez `https://` (pas `http://`)
- N'ajoutez **PAS** de slash final (`/`)
- Pas de chemin après le domaine

### Étape 3 : Sauvegarder

1. Cliquez sur **"SAVE"** (Enregistrer) en bas de la page
2. Attendez quelques minutes (les changements peuvent prendre jusqu'à 5 minutes pour être appliqués)

### Étape 4 : Configuration complète recommandée

Votre OAuth Client ID devrait avoir ces URLs :

**Authorized JavaScript origins:**
```
http://localhost:3000
https://tchadevent-cdl2.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000
https://tchadevent-cdl2.vercel.app
```

---

## 🔐 Vérifier les variables d'environnement sur Vercel

### Étape 1 : Accéder aux paramètres Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet **tchadevent-cdl2**
3. Allez dans **"Settings"** → **"Environment Variables"**

### Étape 2 : Vérifier/Ajouter les variables

Assurez-vous que ces variables sont définies :

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=918965473379-6p5imt5n7jenfc8vfm3s66ofb4adu073.apps.googleusercontent.com
```

⚠️ **Important** :
- Pas d'espaces avant ou après le `=`
- Pas de guillemets autour de la valeur
- La variable doit être disponible pour **Production**, **Preview** et **Development**

### Étape 3 : Redéployer

Après avoir ajouté/modifié les variables d'environnement :

1. Allez dans **"Deployments"**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. Cliquez sur **"Redeploy"**

Ou simplement faites un nouveau commit et push vers votre repository GitHub.

---

## 🧪 Tester

1. Attendez 2-5 minutes après avoir sauvegardé dans Google Cloud Console
2. Allez sur https://tchadevent-cdl2.vercel.app/login
3. Cliquez sur **"Continuer avec Google"**
4. Vous devriez maintenant pouvoir vous connecter sans erreur

---

## 📝 Si vous changez de domaine Vercel

Si vous changez l'URL de votre application Vercel (par exemple, si vous utilisez un domaine personnalisé), vous devrez :

1. Ajouter la nouvelle URL dans Google Cloud Console (dans les deux sections)
2. Mettre à jour les variables d'environnement sur Vercel si nécessaire
3. Redéployer l'application

---

## 🔍 Dépannage

### L'erreur persiste après 5 minutes

- Videz le cache de votre navigateur
- Essayez en navigation privée
- Vérifiez que l'URL dans Google Cloud Console correspond **exactement** à celle de Vercel (sans slash final)

### Erreur "invalid_client"

- Vérifiez que `NEXT_PUBLIC_GOOGLE_CLIENT_ID` est bien défini sur Vercel
- Vérifiez qu'il n'y a pas d'espaces ou de caractères invalides
- Redéployez l'application après avoir modifié les variables

### L'authentification fonctionne en local mais pas sur Vercel

- Vérifiez que l'URL Vercel est bien dans Google Cloud Console
- Vérifiez que les variables d'environnement sont bien définies sur Vercel
- Vérifiez que vous avez redéployé après avoir modifié les variables

---

## ✅ Checklist finale

- [ ] URL Vercel ajoutée dans "Authorized JavaScript origins"
- [ ] URL Vercel ajoutée dans "Authorized redirect URIs"
- [ ] Changements sauvegardés dans Google Cloud Console
- [ ] Variable `NEXT_PUBLIC_GOOGLE_CLIENT_ID` définie sur Vercel
- [ ] Application redéployée sur Vercel
- [ ] Attendu 2-5 minutes pour la propagation
- [ ] Testé la connexion Google sur Vercel

---

**Note** : Les changements dans Google Cloud Console peuvent prendre jusqu'à 5 minutes pour être appliqués. Si l'erreur persiste, attendez un peu plus longtemps et réessayez.

