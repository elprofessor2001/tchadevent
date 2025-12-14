# 🔧 Correction : JWT_SECRET manquant

## ❌ Problème identifié

`JWT_SECRET` n'est pas défini dans votre fichier `.env`, ce qui empêche la génération des tokens JWT pour l'authentification.

## ✅ Solution

### 1. Ouvrez votre fichier `.env` à la racine du projet

### 2. Ajoutez cette ligne :

```env
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire-changez-moi"
```

### 3. Générer un secret sécurisé (optionnel mais recommandé)

**Sur Windows (PowerShell) :**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Ou utilisez un générateur en ligne :**
- https://generate-secret.vercel.app/32

### 4. Exemple de fichier `.env` complet :

```env
DATABASE_URL="mysql://root:@localhost:3306/tchadevent_db"
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire-changez-moi"
```

### 5. Redémarrez le serveur Next.js

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

## ✅ Vérification

Après avoir ajouté JWT_SECRET, testez à nouveau :

1. **Inscription** : `http://localhost:3000/register`
2. **Connexion** : `http://localhost:3000/login`

Ou exécutez le script de test :
```bash
node test-auth.js
```

Vous devriez voir :
```
✅ JWT_SECRET est défini
✅ Inscription réussie
✅ Connexion réussie
```

