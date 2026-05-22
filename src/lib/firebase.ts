import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg_jY5HkeV_wj42AnmLZ4y8bb9wS4eKYo",
  authDomain: "aura-perfumes-store-2026.firebaseapp.com",
  projectId: "aura-perfumes-store-2026",
  storageBucket: "aura-perfumes-store-2026.firebasestorage.app",
  messagingSenderId: "637832956652",
  appId: "1:637832956652:web:6e8a2665efbf2ba55bf3c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
