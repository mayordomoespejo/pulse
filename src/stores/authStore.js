import { create } from 'zustand';

import {
  onAuthStateChanged,
  reauthenticateWithGoogle as firebaseReauthenticateWithGoogle,
  signInWithEmail as firebaseSignInWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  signUpWithEmail as firebaseSignUpWithEmail,
} from '../services/firebase/authService';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  /**
   * Subscribes to Firebase auth state. Call once on app startup.
   * Returns the unsubscribe function.
   */
  init() {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
    return unsubscribe;
  },

  async signInWithEmail(email, password) {
    const user = await firebaseSignInWithEmail(email, password);
    set({ user });
    return user;
  },

  async signUpWithEmail(email, password) {
    const user = await firebaseSignUpWithEmail(email, password);
    set({ user });
    return user;
  },

  async smartAuth(email, password) {
    try {
      const user = await firebaseSignUpWithEmail(email, password);
      set({ user });
      return user;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        const user = await firebaseSignInWithEmail(email, password);
        set({ user });
        return user;
      }
      throw error;
    }
  },

  async signInWithGoogle() {
    const user = await firebaseSignInWithGoogle();
    set({ user });
    return user;
  },

  async reauthenticateWithGoogle() {
    await firebaseReauthenticateWithGoogle();
  },

  async signOut() {
    await firebaseSignOut();
    localStorage.removeItem('video-store');
    set({ user: null });
  },
}));
