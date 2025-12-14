# 🔐 Générer un JWT_SECRET sécurisé

## ✅ Solution rapide (déjà appliquée)

J'ai ajouté `JWT_SECRET` dans votre fichier `.env.local`.

## 🔧 Pour générer un secret plus sécurisé

### Option 1 : PowerShell (Windows)
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

### Option 2 : Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3 : En ligne
https://generate-secret.vercel.app/32

## 📝 Votre fichier `.env.local` devrait contenir :

```env
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire"
```

## ⚠️ Important

- **Ne commitez JAMAIS** `.env.local` dans Git (il est déjà dans `.gitignore`)
- Changez le secret en production
- Utilisez un secret différent pour chaque environnement

