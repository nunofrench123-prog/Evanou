// ============================================================
// Authentification — Evanou
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ---------- Inscription ----------
export async function register(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Enregistre le profil dans Firestore
  await setDoc(doc(db, "users", user.uid), {
    displayName: displayName,
    email:       email,
    createdAt:   new Date().toISOString()
  });

  return user;
}

// ---------- Connexion ----------
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// ---------- Déconnexion ----------
export async function logout() {
  await signOut(auth);
}

// ---------- Écouter les changements d'état d'authentification ----------
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}
