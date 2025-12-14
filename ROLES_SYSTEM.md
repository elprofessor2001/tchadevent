# 🔐 Système de Rôles - TchadEvent

## 📋 Rôles disponibles

### 1. 👤 Participant (client)
- **Nom technique** : `client`
- **Nom affiché** : Participant
- **Description** : Utilisateur standard de la plateforme
- **Permissions** :
  - ✅ Consulter les événements
  - ✅ Réserver des billets
  - ✅ Voir ses réservations
  - ✅ Suivre des organisateurs
  - ❌ Créer des événements
  - ❌ Gérer les utilisateurs
  - ❌ Modérer les événements

### 2. 🎪 Organisateur (organisateur)
- **Nom technique** : `organisateur`
- **Nom affiché** : Organisateur
- **Description** : Créateur et gestionnaire d'événements
- **Permissions** :
  - ✅ Toutes les permissions d'un Participant
  - ✅ Créer des événements
  - ✅ Modifier ses propres événements
  - ✅ Supprimer ses propres événements
  - ✅ Gérer les billets de ses événements
  - ✅ Voir les statistiques de ses événements
  - ✅ Voir les réservations de ses événements
  - ❌ Modifier les événements d'autres organisateurs
  - ❌ Gérer les utilisateurs
  - ❌ Modérer tous les événements

### 3. 👨‍💼 Administrateur (admin)
- **Nom technique** : `admin`
- **Nom affiché** : Administrateur
- **Description** : Gestionnaire de la plateforme (UN SEUL ADMIN)
- **Permissions** :
  - ✅ Toutes les permissions d'un Organisateur
  - ✅ Créer des événements (comme organisateur)
  - ✅ Modifier TOUS les événements
  - ✅ Supprimer TOUS les événements
  - ✅ Vérifier/modérer les événements
  - ✅ Gérer tous les utilisateurs
  - ✅ Changer les rôles des utilisateurs
  - ✅ Supprimer des utilisateurs
  - ✅ Voir toutes les statistiques de la plateforme

## 🔒 Restrictions de sécurité

### Inscription
- ❌ **IMPOSSIBLE** de s'inscrire directement en tant qu'admin
- ✅ Possible de s'inscrire en tant que Participant ou Organisateur
- ✅ Par défaut, les nouveaux utilisateurs sont des Participants

### Promotion en Admin
- ⚠️ **UN SEUL ADMIN** peut exister dans la base de données
- ⚠️ Seul l'admin actuel peut promouvoir un autre utilisateur (et se rétrograder)
- ⚠️ L'admin ne peut pas se supprimer lui-même

### Promotion en Organisateur
- ✅ L'admin peut promouvoir n'importe quel Participant en Organisateur
- ✅ L'admin peut rétrograder un Organisateur en Participant

## 🛡️ Protection des routes API

### Routes publiques
- `GET /api/events` - Liste des événements
- `GET /api/events/[id]` - Détails d'un événement
- `POST /api/auth/register` - Inscription (rôle limité)
- `POST /api/auth/login` - Connexion

### Routes Participant
- `GET /api/bookings` - Mes réservations
- `POST /api/bookings` - Créer une réservation

### Routes Organisateur
- `POST /api/events` - Créer un événement
- `PUT /api/events/[id]` - Modifier SES événements
- `DELETE /api/events/[id]` - Supprimer SES événements
- `PUT /api/tickets/[id]` - Modifier les billets de SES événements
- `DELETE /api/tickets/[id]` - Supprimer les billets de SES événements

### Routes Admin
- `GET /api/users` - Liste de tous les utilisateurs
- `PUT /api/users/[id]` - Modifier un utilisateur (changer le rôle)
- `DELETE /api/users/[id]` - Supprimer un utilisateur
- `PUT /api/events/[id]` - Modifier TOUS les événements
- `DELETE /api/events/[id]` - Supprimer TOUS les événements

## 📝 Notes importantes

1. **Un seul admin** : Le système garantit qu'il n'y a qu'un seul admin à la fois
2. **Rôles OAuth** : Les utilisateurs qui se connectent via Google sont créés avec le rôle "client" par défaut
3. **Rétrogradation** : Un admin peut se rétrograder en organisateur ou participant, mais doit d'abord promouvoir un autre utilisateur en admin
4. **Suppression** : Un admin ne peut pas se supprimer lui-même

