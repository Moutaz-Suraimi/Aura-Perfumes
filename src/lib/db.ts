import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  role: "user" | "admin";
  createdAt: any;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      ...data,
      uid,
      createdAt: serverTimestamp(),
      role: data.email === "waelmoutaz297@gmail.com" ? "admin" : "user",
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}
