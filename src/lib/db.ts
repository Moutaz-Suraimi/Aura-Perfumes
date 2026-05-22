import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
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

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

export interface BankAccount {
  id?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const docRef = doc(db, "settings", "bank_accounts");
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().accounts) {
    return snap.data().accounts as BankAccount[];
  }
  return [];
}

export async function saveBankAccounts(accounts: BankAccount[]) {
  const docRef = doc(db, "settings", "bank_accounts");
  await setDoc(docRef, { accounts }, { merge: true });
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: any;
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt">) {
  const ordersRef = collection(db, "orders");
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserOrders(uid: string): Promise<Order[]> {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
}
