import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User, AuthState } from "../types";
import { authService } from "../services/authService";

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = await authService.getUserData(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    await authService.signUp(email, password, userData);
  };

  const signOut = async () => {
    if (user) {
      try {
        const { getFcmToken } = await import("../services/push-notification-service");
        const token = await getFcmToken();
        if (token) {
          const { doc, getDoc, updateDoc } = await import("firebase/firestore");
          const { db } = await import("../services/firebase");
          const userRef = doc(db, 'users', user.id);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const current = snap.data()?.pushTokens ?? [];
            const filtered = current.filter((t: any) => !(t.platform === 'web' && t.token === token));
            await updateDoc(userRef, { pushTokens: filtered });
          }
        }
      } catch (e) {
        console.warn("Could not remove web push token before logout", e);
      }
    }
    await authService.signOut();
    setUser(null);
  };

  const isAdmin = authService.isAdmin(user);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: loading,
      isAuthenticated: !!user,
      error: null,
      signIn,
      signUp,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
