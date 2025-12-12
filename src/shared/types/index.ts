export interface UserProfile {
  fullName: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  activeRole: string;
  roles: string[];
  status: string;
  profile: UserProfile;
  addresses?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}
