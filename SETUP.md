# Guide de configuration TchadEvent

## Étapes de configuration

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de la base de données

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
DATABASE_URL="mysql://user:password@localhost:3306/tchadevent"
JWT_SECRET="votre-secret-jwt-tres-securise-et-aleatoire-changez-moi"
```

**Important** : Remplacez :
- `user` par votre nom d'utilisateur MySQL
- `password` par votre mot de passe MySQL
- `tchadevent` par le nom de votre base de données
- `JWT_SECRET` par une chaîne aléatoire sécurisée (utilisez `openssl rand -base64 32` pour en générer une)

### 3. Création de la base de données

Connectez-vous à MySQL et créez la base de données :

```sql
CREATE DATABASE tchadevent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Génération du client Prisma

```bash
npx prisma generate
```

Cette commande génère le client Prisma basé sur le schéma dans `prisma/schema.prisma`.

### 5. Application des migrations

```bash
npx prisma migrate dev --name init
```

Cette commande crée les tables dans votre base de données MySQL.

### 6. (Optionnel) Visualiser la base de données

```bash
npx prisma studio
```

Ouvre une interface graphique pour visualiser et modifier les données.

### 7. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Notes importantes

- Après chaque modification du schéma Prisma (`prisma/schema.prisma`), vous devez :
  1. Exécuter `npx prisma generate`
  2. Créer une migration avec `npx prisma migrate dev --name nom_de_la_migration`

- Le fichier `.env` ne doit jamais être commité dans Git (il est déjà dans `.gitignore`)

- Pour la production, assurez-vous d'utiliser des variables d'environnement sécurisées

