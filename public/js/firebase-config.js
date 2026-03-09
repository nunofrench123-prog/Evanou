// ============================================================
// Configuration Firebase — Evanou
// ============================================================
// IMPORTANT : Remplace les valeurs ci-dessous par celles de
// ton propre projet Firebase.
//
// Pour les obtenir :
// 1. Va sur https://console.firebase.google.com/
// 2. Crée un projet (ou ouvre le tien)
// 3. Clique sur l'icône </> (Web) pour ajouter une app web
// 4. Copie les valeurs de firebaseConfig ici
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "REMPLACE_PAR_TA_CLE_API",
  authDomain:        "REMPLACE.firebaseapp.com",
  projectId:         "REMPLACE",
  storageBucket:     "REMPLACE.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exporte les services pour les autres modules
export const auth = getAuth(app);
export const db   = getFirestore(app);
