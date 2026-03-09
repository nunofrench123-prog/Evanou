// ============================================================
// Application principale — Evanou
// ============================================================

import { login, register, logout, onAuthChange } from "./auth.js";
import { db }                                     from "./firebase-config.js";
import {
  sendMessage,
  deleteMessage,
  listenMessages,
  addNote,
  deleteNote,
  listenNotes
} from "./database.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// ---------- Éléments du DOM ----------
const authContainer  = document.getElementById("auth-container");
const appContainer   = document.getElementById("app-container");

const loginForm      = document.getElementById("login-form");
const registerForm   = document.getElementById("register-form");
const showRegister   = document.getElementById("show-register");
const showLogin      = document.getElementById("show-login");
const authError      = document.getElementById("auth-error");

const userNameEl     = document.getElementById("user-name");
const logoutBtn      = document.getElementById("logout-btn");

const tabButtons     = document.querySelectorAll(".tab-btn");

const messagesList   = document.getElementById("messages-list");
const messageForm    = document.getElementById("message-form");
const messageInput   = document.getElementById("message-input");

const notesList      = document.getElementById("notes-list");
const noteForm       = document.getElementById("note-form");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");

// ---------- État ----------
let currentUser      = null;
let currentUserName  = "";
let unsubMessages    = null;
let unsubNotes       = null;

// ==================== AUTHENTIFICATION ====================

function showError(message) {
  authError.textContent = message;
  authError.classList.remove("hidden");
  setTimeout(() => authError.classList.add("hidden"), 5000);
}

function translateFirebaseError(code) {
  const errors = {
    "auth/email-already-in-use":   "Cet email est déjà utilisé.",
    "auth/invalid-email":          "Email invalide.",
    "auth/weak-password":          "Mot de passe trop faible (6 caractères minimum).",
    "auth/user-not-found":         "Aucun compte avec cet email.",
    "auth/wrong-password":         "Mot de passe incorrect.",
    "auth/invalid-credential":     "Email ou mot de passe incorrect.",
    "auth/too-many-requests":      "Trop de tentatives. Réessaie plus tard."
  };
  return errors[code] || "Une erreur est survenue. Réessaie.";
}

// Basculer entre les formulaires
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  authError.classList.add("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  authError.classList.add("hidden");
});

// Connexion
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await login(email, password);
  } catch (err) {
    showError(translateFirebaseError(err.code));
  }
});

// Inscription
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name     = document.getElementById("register-name").value.trim();
  const email    = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;

  try {
    await register(email, password, name);
  } catch (err) {
    showError(translateFirebaseError(err.code));
  }
});

// Déconnexion
logoutBtn.addEventListener("click", async () => {
  await logout();
});

// Observer l'état d'authentification
onAuthChange(async (user) => {
  if (user) {
    currentUser = user;

    // Récupère le nom depuis Firestore
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      currentUserName = snap.exists() ? snap.data().displayName : user.email;
    } catch (_err) {
      currentUserName = user.email;
    }

    userNameEl.textContent = currentUserName;
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");

    // Lance les écouteurs en temps réel
    startListeners();
  } else {
    currentUser     = null;
    currentUserName = "";
    authContainer.classList.remove("hidden");
    appContainer.classList.add("hidden");

    // Stoppe les écouteurs
    stopListeners();
  }
});

// ==================== ONGLETS ====================

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ==================== MESSAGES ====================

function renderMessages(messages) {
  if (messages.length === 0) {
    messagesList.innerHTML = '<div class="empty-state">Pas encore de messages 💌</div>';
    return;
  }

  messagesList.innerHTML = messages
    .map((msg) => {
      const isOwn    = currentUser && msg.authorId === currentUser.uid;
      const date     = new Date(msg.createdAt).toLocaleString("fr-FR");
      const deleteEl = isOwn
        ? `<button class="delete-btn" data-type="message" data-id="${msg.id}" title="Supprimer">🗑️</button>`
        : "";
      return `
        <div class="item-card">
          ${deleteEl}
          <div class="item-author">${escapeHTML(msg.authorName)}</div>
          <div class="item-text">${escapeHTML(msg.text)}</div>
          <div class="item-date">${date}</div>
        </div>`;
    })
    .join("");

  // Scroll vers le bas pour voir le dernier message
  messagesList.scrollTop = messagesList.scrollHeight;
}

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !currentUser) return;

  messageInput.value = "";
  await sendMessage(currentUser.uid, currentUserName, text);
});

// ==================== NOTES ====================

function renderNotes(notes) {
  if (notes.length === 0) {
    notesList.innerHTML = '<div class="empty-state">Pas encore de notes 📝</div>';
    return;
  }

  notesList.innerHTML = notes
    .map((note) => {
      const isOwn    = currentUser && note.authorId === currentUser.uid;
      const date     = new Date(note.createdAt).toLocaleString("fr-FR");
      const deleteEl = isOwn
        ? `<button class="delete-btn" data-type="note" data-id="${note.id}" title="Supprimer">🗑️</button>`
        : "";
      return `
        <div class="item-card">
          ${deleteEl}
          <div class="item-author">${escapeHTML(note.authorName)}</div>
          <div class="item-title">${escapeHTML(note.title)}</div>
          <div class="item-text">${escapeHTML(note.content)}</div>
          <div class="item-date">${date}</div>
        </div>`;
    })
    .join("");
}

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title   = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  if (!title || !content || !currentUser) return;

  noteTitleInput.value   = "";
  noteContentInput.value = "";
  await addNote(currentUser.uid, currentUserName, title, content);
});

// ==================== LISTENERS EN TEMPS RÉEL ====================

function startListeners() {
  unsubMessages = listenMessages(renderMessages);
  unsubNotes    = listenNotes(renderNotes);
}

function stopListeners() {
  if (unsubMessages) { unsubMessages(); unsubMessages = null; }
  if (unsubNotes)    { unsubNotes();    unsubNotes    = null; }
}

// ==================== SUPPRESSION ====================

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  const type = btn.dataset.type;
  const id   = btn.dataset.id;

  if (type === "message") await deleteMessage(id);
  if (type === "note")    await deleteNote(id);
});

// ==================== UTILITAIRES ====================

function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
