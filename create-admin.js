import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
const db = getFirestore(app);

async function createAdmin() {
  try {
    console.log("Creating admin...");
    const cred = await createUserWithEmailAndPassword(auth, "waelmoutaz297@gmail.com", "Aura2026!admin");
    await setDoc(doc(db, "users", cred.user.uid), {
      name: "المدير العام",
      email: "waelmoutaz297@gmail.com",
      role: "admin",
      createdAt: serverTimestamp()
    });
    console.log("Admin account created successfully!");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
       console.log("Admin account already exists! Password is unchanged.");
       process.exit(0);
    }
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
