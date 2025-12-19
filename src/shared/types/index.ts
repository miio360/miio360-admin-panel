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
  slug: string; // Nombre sin espacios para URLs amigables
  description?: string;
  tags?: string[]; // Tags para búsqueda con sinónimos
  status: 'active' | 'inactive';
  parentId?: string | null; // Para categorías anidadas/subcategorías
  icon?: string; // Nombre del icono o emoji
  imageUrl?: string; // URL de imagen de la categoría
  order?: number; // Para ordenar/priorizar categorías
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
