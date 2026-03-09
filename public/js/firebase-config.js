// ============================================================
// Configuration Firebase — Evanou
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyB9uhShDPb8Vsd4UVqXZN8Qj3TjEWA2Hl4",
  authDomain:        "evanou-couple.firebaseapp.com",
  projectId:         "evanou-couple",
  storageBucket:     "evanou-couple.firebasestorage.app",
  messagingSenderId: "77495825868",
  appId:             "1:77495825868:web:1fa6d6a84948f863cbd969"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Exporte les services pour les autres modules
export const auth = getAuth(app);
export const db   = getFirestore(app);