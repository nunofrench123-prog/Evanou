# 💕 Evanou

Une application personnelle pour moi et ma copine.

## Fonctionnalités

- 🔐 **Authentification** — Inscription et connexion par email/mot de passe (Firebase Auth)
- 💬 **Messages** — Envoyer et lire des messages en temps réel (Firestore)
- 📝 **Notes** — Créer et partager des notes ensemble (Firestore)
- 🌐 **Hébergement** — Prêt à déployer sur Firebase Hosting

## Structure du projet

```
Evanou/
├── public/                  ← Fichiers de l'application web
│   ├── index.html           ← Page principale
│   ├── css/style.css        ← Styles
│   └── js/
│       ├── firebase-config.js  ← Configuration Firebase
│       ├── auth.js             ← Authentification
│       ├── database.js         ← Base de données (Firestore)
│       └── app.js              ← Logique de l'application
├── firebase.json            ← Configuration Firebase Hosting
├── firestore.rules          ← Règles de sécurité Firestore
├── firestore.indexes.json   ← Index Firestore
└── package.json             ← Dépendances du projet
```

## Comment configurer

### 1. Créer un projet Firebase

1. Va sur [console.firebase.google.com](https://console.firebase.google.com/)
2. Clique sur **Ajouter un projet**
3. Nomme-le `evanou` (ou ce que tu veux)
4. Suis les étapes (tu peux désactiver Google Analytics si tu veux)

### 2. Activer les services Firebase

Dans la console Firebase de ton projet :

- **Authentication** → Onglet *Sign-in method* → Active **Email/Mot de passe**
- **Firestore Database** → Clique *Créer une base de données* → Choisis le mode **production**
- **Hosting** → Clique *Commencer*

### 3. Ajouter une application web

1. Dans la console Firebase, clique sur l'icône **</>** (Web)
2. Nomme l'app `evanou`
3. Copie les valeurs de `firebaseConfig`
4. Colle-les dans le fichier `public/js/firebase-config.js` à la place des valeurs `REMPLACE...`

### 4. Installer et déployer

```bash
# Installe les dépendances
npm install

# Connecte-toi à Firebase
npx firebase login

# Initialise le lien vers ton projet
npx firebase use --add

# Déploie l'application
npm run deploy
```

Ton application sera disponible à l'adresse : `https://ton-projet.web.app` 🎉

## Développement local

```bash
# Lance les émulateurs Firebase en local
npm start
```

Ensuite ouvre [http://localhost:5000](http://localhost:5000) dans ton navigateur.
