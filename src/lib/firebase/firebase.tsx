// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, getDoc, setDoc, doc } from "firebase/firestore";
import type { User } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAcHIyBBsBD4aUkbleWCTaKkNneQElUbbw",
  authDomain: "connote-317f0.firebaseapp.com",
  projectId: "connote-317f0",
  storageBucket: "connote-317f0.firebasestorage.app",
  messagingSenderId: "82838738292",
  appId: "1:82838738292:web:56c5d4fed9c73be38e8821",
  measurementId: "G-E9EVMDVJK2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
export const db = getFirestore(app);

export const createUser = async (email: string, password: string) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signInUser = async (email: string, password: string) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const resetPassword = async (email: string) => {
  if (!email) return;
  return await sendPasswordResetEmail(auth, email);
};

export const signOutUser = async () => signOut(auth);

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const authStateChangedlistener = (
  callback: (user: User | null) => void
) => onAuthStateChanged(auth, callback);

export const storeUser = async (user: User, name?: string) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    const { uid, displayName, email } = user;
    await setDoc(userRef, {
      id: uid,
      name: displayName || name || "Anonymous",
      email,
      createdAt: new Date().toISOString(),
    });
  }
};
