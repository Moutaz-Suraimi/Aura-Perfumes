import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAg_jY5HkeV_wj42AnmLZ4y8bb9wS4eKYo",
  authDomain: "aura-perfumes-store-2026.firebaseapp.com",
  projectId: "aura-perfumes-store-2026",
  storageBucket: "aura-perfumes-store-2026.firebasestorage.app",
  messagingSenderId: "637832956652",
  appId: "1:637832956652:web:6e8a2665efbf2ba55bf3c9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function reset() {
  try {
    await sendPasswordResetEmail(auth, "waelmoutaz297@gmail.com");
    console.log("Password reset email sent!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
reset();
