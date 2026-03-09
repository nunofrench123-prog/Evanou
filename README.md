# Evanou ✈️

**Votre espace privé pour organiser vos voyages en couple** — en temps réel, sur tous vos appareils.

## ✨ Fonctionnalités

- 🔄 **Synchronisation temps réel** — Toute modification faite par l'un apparaît instantanément chez l'autre
- 🔐 **Authentification** — Espace privé pour vous deux
- ✈️ **Gestion complète des voyages** — Créer, modifier, supprimer des voyages
- ⏱️ **Widget compte à rebours** — Affiche le temps restant avant le prochain voyage
- 📅 **Programme & activités** — Planifiez chaque journée
- 🧳 **Liste de valises** — Cochez les articles au fur et à mesure
- 💰 **Budget & dépenses** — Suivez vos dépenses avec une barre de progression
- 📝 **Notes & idées** — Notez adresses, idées, infos utiles
- 📊 **Tableau de bord** — Vue d'ensemble de tous vos voyages
- 📱 **Responsive** — Fonctionne sur mobile et desktop

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone <repo-url>
cd evanou
npm install
```

### 2. Configurer Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez **Authentication** (Email/Password)
3. Créez une base de données **Firestore** (en mode production)
4. Copiez votre configuration Firebase

```bash
cp .env.example .env
```

Remplissez `.env` avec vos clés Firebase :

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 3. Règles Firestore

Dans la console Firebase → Firestore → Règles :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

## 🏗️ Stack technique

- **Frontend** : React 19 + Vite
- **Style** : Tailwind CSS
- **Backend** : Firebase (Firestore + Auth)
- **Routing** : React Router v7
- **Dates** : date-fns
- **Icônes** : Lucide React

## 📁 Structure

```
src/
├── components/       # Composants réutilisables
│   ├── Layout.jsx        # Sidebar + navigation
│   ├── CountdownWidget.jsx  # Compte à rebours
│   ├── TripCard.jsx      # Carte voyage
│   └── TripModal.jsx     # Modal création/édition
├── context/
│   └── AuthContext.jsx   # Gestion authentification
├── firebase/
│   ├── config.js         # Config Firebase
│   └── firestore.js      # Fonctions Firestore
└── pages/
    ├── LoginPage.jsx     # Connexion / Inscription
    ├── Dashboard.jsx     # Tableau de bord
    ├── TripsPage.jsx     # Liste des voyages
    └── TripDetail.jsx    # Détail d'un voyage
```
