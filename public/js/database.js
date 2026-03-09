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

// ==================== VOYAGES ====================

/**
 * Ajoute un voyage dans Firestore.
 */
export async function addVoyage(authorId, authorName, name, destination, departDate, returnDate, budget, notes) {
  await addDoc(collection(db, "voyages"), {
    authorId:    authorId,
    authorName:  authorName,
    name:        name,
    destination: destination,
    departDate:  departDate,
    returnDate:  returnDate,
    budget:      budget,
    notes:       notes,
    createdAt:   new Date().toISOString()
  });
}

/**
 * Supprime un voyage par son identifiant.
 */
export async function deleteVoyage(voyageId) {
  await deleteDoc(doc(db, "voyages", voyageId));
}

/**
 * Écoute les voyages en temps réel (triés par date de départ, les plus proches en premier).
 * @param {function} callback - Reçoit un tableau de voyages.
 * @returns {function} Fonction pour se désabonner.
 */
export function listenVoyages(callback) {
  const q = query(collection(db, "voyages"), orderBy("departDate", "asc"));
  return onSnapshot(q, (snapshot) => {
    const voyages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(voyages);
  });
}
