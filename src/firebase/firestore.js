import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';

// ───── TRIPS ─────────────────────────────────────────────────────────────────

/** Listen in real-time to trips belonging to a user */
export function subscribeToTrips(uid, callback) {
  const q = query(
    collection(db, 'trips'),
    where('participants', 'array-contains', uid),
    orderBy('startDate', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(trips);
  });
}

/** Listen in real-time to a single trip document */
export function subscribeToTrip(id, callback) {
  return onSnapshot(
    doc(db, 'trips', id),
    (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    () => callback(null)
  );
}

/** Create a new trip scoped to the authenticated user */
export async function createTrip(data, uid) {
  return addDoc(collection(db, 'trips'), {
    ...data,
    ownerId: uid,
    participants: [uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Update a trip */
export async function updateTrip(id, data) {
  return updateDoc(doc(db, 'trips', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a trip and all its subcollections */
export async function deleteTrip(id) {
  const subcollections = ['activities', 'packing', 'expenses'];
  for (const sub of subcollections) {
    const snap = await getDocs(collection(db, 'trips', id, sub));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
  // Delete the notes meta document
  await deleteDoc(doc(db, 'trips', id, 'meta', 'notes')).catch(() => {});
  return deleteDoc(doc(db, 'trips', id));
}

/** Get a single trip (one-time read) */
export async function getTrip(id) {
  const snap = await getDoc(doc(db, 'trips', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ───── ACTIVITIES ─────────────────────────────────────────────────────────────

/** Listen in real-time to activities of a trip */
export function subscribeToActivities(tripId, callback) {
  const q = query(
    collection(db, 'trips', tripId, 'activities'),
    orderBy('date', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(activities);
  });
}

export async function addActivity(tripId, data) {
  return addDoc(collection(db, 'trips', tripId, 'activities'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateActivity(tripId, activityId, data) {
  return updateDoc(doc(db, 'trips', tripId, 'activities', activityId), data);
}

export async function deleteActivity(tripId, activityId) {
  return deleteDoc(doc(db, 'trips', tripId, 'activities', activityId));
}

// ───── PACKING LIST ───────────────────────────────────────────────────────────

export function subscribeToPackingList(tripId, callback) {
  const q = query(
    collection(db, 'trips', tripId, 'packing'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function addPackingItem(tripId, data) {
  return addDoc(collection(db, 'trips', tripId, 'packing'), {
    ...data,
    checked: false,
    createdAt: serverTimestamp(),
  });
}

export async function togglePackingItem(tripId, itemId, checked) {
  return updateDoc(doc(db, 'trips', tripId, 'packing', itemId), { checked });
}

export async function deletePackingItem(tripId, itemId) {
  return deleteDoc(doc(db, 'trips', tripId, 'packing', itemId));
}

// ───── EXPENSES ───────────────────────────────────────────────────────────────

export function subscribeToExpenses(tripId, callback) {
  const q = query(
    collection(db, 'trips', tripId, 'expenses'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

export async function addExpense(tripId, data) {
  return addDoc(collection(db, 'trips', tripId, 'expenses'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function deleteExpense(tripId, expenseId) {
  return deleteDoc(doc(db, 'trips', tripId, 'expenses', expenseId));
}

// ───── NOTES ─────────────────────────────────────────────────────────────────

export function subscribeToNotes(tripId, callback) {
  const ref = doc(db, 'trips', tripId, 'meta', 'notes');
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().content || '' : '');
  });
}

export async function saveNotes(tripId, content) {
  return setDoc(doc(db, 'trips', tripId, 'meta', 'notes'), { content });
}
