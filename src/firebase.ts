import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// Read Firebase configuration from Vite environment variables (import.meta.env.VITE_...)
const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";

const firebaseConfig = {
  apiKey: rawApiKey || "AIzaSyMockKeyForDevOnly_ConfigureInRender",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "filax-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "filax-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "filax-store.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

// Check if a real, valid Firebase API key is present
export const isFirebaseConfigured = Boolean(
  rawApiKey &&
  rawApiKey.startsWith("AIzaSy") &&
  rawApiKey.length === 39 &&
  !rawApiKey.includes("MockKey")
);

// Singleton initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const db = getFirestore(app);

export {
  app,
  auth,
  googleProvider,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
  signInWithPopup,
  signOut,
  firebaseConfig,
};
