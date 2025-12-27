import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "../types";

export const authService = {
  // Sign up
  async signUp(email: string, password: string, userData: Partial<User>): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    const newUser = {
      email,
      emailVerified: false,
      phoneVerified: false,
      activeRole: 'admin',
      roles: ['admin'],
      status: 'active',
      profile: userData.profile || {
        fullName: '',
        phone: '',
      },
      addresses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userId), newUser);
  },

  // Sign in
  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  // Sign out
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  // Get user data
  async getUserData(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      } as User;
    }
    return null;
  },

  // Check if user is admin
  isAdmin(user: User | null): boolean {
    return user?.roles?.includes('admin') || false;
  },

  // Auth state observer
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
