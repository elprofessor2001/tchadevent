# 🎉 TchadEvent

> Plateforme web moderne de gestion et promotion d'événements au Tchad

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19-2D3748)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📖 Description

**TchadEvent** est une plateforme web moderne dédiée à la gestion, la promotion et la réservation d'événements au Tchad.

Elle répond à un besoin réel de centralisation et de digitalisation du secteur événementiel, encore largement dominé par le bouche-à-oreille et les réseaux sociaux.

---

## ✨ Fonctionnalités

### 👥 Pour les participants
- Découverte d'événements par catégorie, date, lieu et popularité
- Recherche avancée avec filtres
- Réservation et achat de billets
- Paiements mobiles (Airtel Money / Moov Money)
- Authentification classique et Google OAuth
- Interface responsive (mobile, tablette, desktop)
- Historique des réservations

### 🎪 Pour les organisateurs
- Création et gestion d'événements
- Upload d'images depuis l'ordinateur
- Gestion des billets et des prix
- Suivi des inscriptions et statistiques
- Visualisation des revenus
- Tableau de bord avec statistiques en temps réel

### 👨‍💼 Pour l'administrateur
- Gestion complète des utilisateurs et des rôles
- Modération des événements
- Statistiques globales de la plateforme

---

## 🛠️ Technologies

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend** : Next.js API Routes, Prisma ORM, MySQL 8
- **Authentification** : JWT, bcrypt, Google OAuth 2.0
- **Paiements** : Airtel Money, Moov Money

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- MySQL 8+
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/elprofessor2001/tchadevent.git
   cd tchadevent
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env.local` à la racine du projet avec les variables nécessaires (voir la documentation pour plus de détails).

4. **Configurer Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Créer le compte administrateur**
   ```bash
   npm run create-admin
   ```

6. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

7. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

---

## 📝 Scripts disponibles

```bash
npm run dev              # Serveur de développement
npm run build            # Build de production
npm start                # Serveur de production
npm run create-admin     # Créer le compte admin
npx prisma studio        # Interface Prisma Studio
```

---

## 📚 Documentation

- [`ROLES_SYSTEM.md`](./ROLES_SYSTEM.md) - Système de rôles
- [`PAIEMENTS.md`](./PAIEMENTS.md) - Configuration des paiements
- [`GOOGLE_OAUTH_SETUP.md`](./GOOGLE_OAUTH_SETUP.md) - Configuration OAuth Google
- [`GITHUB_SETUP.md`](./GITHUB_SETUP.md) - Guide de mise en ligne sur GitHub

---

## 🔐 Sécurité

- Authentification JWT sécurisée
- Mots de passe hashés avec bcrypt
- Protection des routes API par rôle
- Validation des données côté serveur
- Upload d'images sécurisé

---

## 📄 Licence

Ce projet est privé.

---

## 👨‍💻 Auteur

**WORE TAOKREO Gnawé Parfait**

- GitHub: [@elprofessor2001](https://github.com/elprofessor2001)
- WhatsApp: [+221 76 676 25 42](https://wa.me/221766762542)

---

## 🙏 Remerciements

Merci à tous ceux qui contribuent au développement du secteur événementiel au Tchad.
