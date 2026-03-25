import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  reauthenticateWithPopup,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

import { auth } from './firebaseClient';

/**
 * Signs in a user with email and password.
 */
export async function signInWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

/**
 * Creates a new user with email and password.
 */
export async function signUpWithEmail(email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

/**
 * Signs in with Google via popup.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

/**
 * Re-authenticates the current user with Google via popup.
 */
export async function reauthenticateWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await reauthenticateWithPopup(auth, provider);
}

/**
 * Signs the current user out.
 */
export async function signOut() {
  await auth.signOut();
}

/**
 * Subscribes to auth state changes. Returns unsubscribe function.
 */
export function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Returns the currently signed-in user or null.
 */
export function getCurrentUser() {
  return auth.currentUser;
}
