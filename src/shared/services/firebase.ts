import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCWcx7byQrGtbTZCivpsS-iYfXPKq0OHOw",
  authDomain: "miio360.firebaseapp.com",
  projectId: "miio360",
  storageBucket: "miio360.firebasestorage.app",
  messagingSenderId: "256233957354",
  appId: "1:256233957354:web:4dbab69e37dcec78567493",
  measurementId: "G-D7SZGLFHR0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
