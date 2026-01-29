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
