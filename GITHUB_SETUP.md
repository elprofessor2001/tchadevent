# 🚀 Guide de mise en ligne sur GitHub

Ce guide vous explique comment mettre votre projet TchadEvent sur GitHub.

## 📋 Prérequis

1. Un compte GitHub (créé sur [github.com](https://github.com))
2. Git installé sur votre machine
3. Le repository `tchadevent` créé sur GitHub

## 🔧 Étapes de configuration

### 1. Vérifier l'état de Git

```bash
# Vérifier si Git est initialisé
git status
```

Si Git n'est pas initialisé, exécutez :
```bash
git init
```

### 2. Vérifier le .gitignore

Assurez-vous que le fichier `.gitignore` contient bien :
- `.env*` (pour ne pas commiter les secrets)
- `node_modules/`
- `.next/`
- `public/uploads/**` (sauf `.gitkeep`)

### 3. Ajouter tous les fichiers

```bash
# Ajouter tous les fichiers au staging
git add .

# Vérifier ce qui sera commité
git status
```

### 4. Créer le premier commit

```bash
git commit -m "🎉 Initial commit - TchadEvent Platform

- Plateforme complète de gestion d'événements
- Authentification JWT + OAuth Google
- Système de rôles (Participant, Organisateur, Admin)
- Upload d'images
- Paiements Airtel Money et Moov Money
- Dashboard admin avec statistiques
- Design moderne et responsive"
```

### 5. Connecter au repository GitHub

```bash
# Ajouter le remote (remplacez par votre URL si différente)
git remote add origin https://github.com/elprofessor2001/tchadevent.git

# Vérifier le remote
git remote -v
```

### 6. Pousser vers GitHub

```bash
# Pousser vers la branche main
git branch -M main
git push -u origin main
```

## 🔐 Variables d'environnement

**IMPORTANT** : Ne commitez JAMAIS le fichier `.env.local` !

Le fichier `.gitignore` est déjà configuré pour ignorer les fichiers `.env*`.

### Pour les autres développeurs

Créez un fichier `.env.example` (optionnel) avec les variables sans les valeurs :

```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:3306/tchadevent_db"

# JWT
JWT_SECRET="your-secret-here"

# OAuth Google
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"

# Paiements
# AIRTEL_MONEY_API_KEY=
# AIRTEL_MONEY_API_SECRET=
# AIRTEL_MONEY_MERCHANT_ID=
# NEXT_PUBLIC_AIRTEL_MONEY_ENABLED=false

# MOOV_MONEY_API_KEY=
# MOOV_MONEY_API_SECRET=
# MOOV_MONEY_MERCHANT_ID=
# NEXT_PUBLIC_MOOV_MONEY_ENABLED=false
```

## 📝 Commandes Git utiles

### Voir l'état
```bash
git status
```

### Ajouter des fichiers
```bash
git add .                    # Tous les fichiers
git add fichier.ts           # Un fichier spécifique
```

### Commiter
```bash
git commit -m "Description du changement"
```

### Pousser vers GitHub
```bash
git push origin main
```

### Récupérer les dernières modifications
```bash
git pull origin main
```

### Voir l'historique
```bash
git log
```

## 🎯 Workflow recommandé

1. **Travailler sur une fonctionnalité**
   ```bash
   git checkout -b feature/nom-fonctionnalite
   # Faire vos modifications
   git add .
   git commit -m "Ajout de la fonctionnalité X"
   git push origin feature/nom-fonctionnalite
   ```

2. **Créer une Pull Request sur GitHub**
   - Allez sur votre repository GitHub
   - Cliquez sur "Pull requests"
   - Cliquez sur "New pull request"
   - Sélectionnez votre branche
   - Créez la PR

3. **Merger dans main**
   - Après review, mergez la PR
   - Supprimez la branche si nécessaire

## ⚠️ Fichiers à ne JAMAIS commiter

- `.env.local` ou tout fichier `.env*`
- `node_modules/`
- `.next/`
- Fichiers de logs
- Clés API ou secrets
- Images uploadées dans `public/uploads/` (sauf `.gitkeep`)

## 🔄 Mise à jour du repository

Après chaque modification importante :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

## 📦 Structure recommandée pour GitHub

Votre repository devrait contenir :
- ✅ Code source (app/, components/, lib/, etc.)
- ✅ Configuration (package.json, tsconfig.json, etc.)
- ✅ Documentation (README.md, guides)
- ✅ Schéma Prisma (prisma/schema.prisma)
- ✅ Scripts (scripts/)
- ❌ `.env.local` (ignoré)
- ❌ `node_modules/` (ignoré)
- ❌ `.next/` (ignoré)

## 🎉 C'est prêt !

Une fois le code poussé sur GitHub, votre repository sera accessible à :
```
https://github.com/elprofessor2001/tchadevent
```

Vous pourrez ensuite :
- Partager le lien avec d'autres développeurs
- Déployer sur Vercel/Netlify
- Collaborer avec d'autres personnes
- Suivre les issues et contributions

