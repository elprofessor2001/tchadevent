# 🔧 Corriger le nom "ConvertX" dans Google OAuth

Si vous voyez encore "ConvertX" lors de la connexion Google, voici comment le corriger définitivement :

## 📍 Où changer le nom

Le nom affiché lors de la connexion Google vient de **l'écran de consentement OAuth**, pas du nom du projet Google Cloud.

### Étapes détaillées :

1. **Allez sur Google Cloud Console**
   - URL : https://console.cloud.google.com/
   - Connectez-vous avec votre compte Google

2. **Sélectionnez le bon projet**
   - En haut de la page, vérifiez que vous êtes dans le bon projet
   - Le nom du projet peut être différent (c'est normal)

3. **Accédez à l'écran de consentement OAuth**
   - Menu de gauche : **"APIs & Services"**
   - Cliquez sur **"OAuth consent screen"**

4. **Modifiez le nom de l'application**
   - Cliquez sur le bouton **"EDIT APP"** (en haut à droite)
   - Dans la section **"App information"** :
     - **App name** : Supprimez "ConvertX" et mettez **"TchadEvent"**
     - **User support email** : Votre email
     - **Developer contact information** : Votre email
   - Cliquez sur **"SAVE AND CONTINUE"**

5. **Vérifiez les scopes**
   - Section "Scopes"
   - Assurez-vous d'avoir : `email`, `profile`, `openid`
   - Cliquez sur **"SAVE AND CONTINUE"**

6. **Test users** (si en mode Testing)
   - Si votre app est en mode "Testing", ajoutez votre email
   - Cliquez sur **"SAVE AND CONTINUE"**

7. **Publier** (optionnel)
   - Si vous voulez que tous les utilisateurs puissent se connecter, cliquez sur **"PUBLISH APP"**
   - Sinon, gardez en mode "Testing" pour le développement

## ⚠️ Points importants

### Différence entre "Nom du projet" et "Nom de l'application"

- **Nom du projet Google Cloud** : Peut être "ConvertX" ou autre chose (ce n'est pas grave)
- **Nom de l'application OAuth** : C'est celui qui s'affiche lors de la connexion (doit être "TchadEvent")

### Cache et propagation

- Les changements peuvent prendre **5-10 minutes** à se propager
- **Videz le cache de votre navigateur** (Ctrl+Shift+Delete)
- **Fermez et rouvrez** la popup Google
- **Testez en navigation privée** pour éviter le cache

## 🔍 Vérification

Après avoir modifié le nom :

1. Attendez 5-10 minutes
2. Videz le cache de votre navigateur
3. Allez sur `http://localhost:3000/login`
4. Cliquez sur "Continuer avec Google"
5. Vous devriez voir **"TchadEvent"** au lieu de "ConvertX"

## 📝 Si ça ne fonctionne pas

1. **Vérifiez que vous avez bien sauvegardé** : Cliquez sur tous les "SAVE AND CONTINUE"
2. **Vérifiez le statut** : L'application doit être soit "Testing" soit "In production"
3. **Vérifiez les scopes** : `email`, `profile`, `openid` doivent être présents
4. **Attendez plus longtemps** : Parfois ça prend jusqu'à 30 minutes

## 🎯 Résultat attendu

Lors de la connexion, vous devriez voir :
```
Sélectionnez un compte

Accéder à l'application TchadEvent
```

Au lieu de :
```
Sélectionnez un compte

Accéder à l'application ConvertX
```

