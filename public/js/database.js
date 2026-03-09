// ============================================================
// Base de données (Firestore) — Evanou
// ============================================================

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ==================== MESSAGES ====================

/**
 * Envoie un message dans Firestore.
 */
export async function sendMessage(authorId, authorName, text) {
  await addDoc(collection(db, "messages"), {
    authorId:   authorId,
    authorName: authorName,
    text:       text,
    createdAt:  new Date().toISOString()
  });
}

/**
 * Supprime un message par son identifiant.
 */
export async function deleteMessage(messageId) {
  await deleteDoc(doc(db, "messages", messageId));
}

/**
 * Écoute les messages en temps réel (les plus récents en bas).
 * @param {function} callback - Reçoit un tableau de messages.
 * @returns {function} Fonction pour se désabonner.
 */
export function listenMessages(callback) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(messages);
  });
}

// ==================== NOTES ====================

/**
 * Ajoute une note dans Firestore.
 */
export async function addNote(authorId, authorName, title, content) {
  await addDoc(collection(db, "notes"), {
    authorId:   authorId,
    authorName: authorName,
    title:      title,
    content:    content,
    createdAt:  new Date().toISOString()
  });
}

/**
 * Supprime une note par son identifiant.
 */
export async function deleteNote(noteId) {
  await deleteDoc(doc(db, "notes", noteId));
}

/**
 * Écoute les notes en temps réel (les plus récentes en haut).
 * @param {function} callback - Reçoit un tableau de notes.
 * @returns {function} Fonction pour se désabonner.
 */
export function listenNotes(callback) {
  const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notes);
  });
}
