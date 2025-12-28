import { Timestamp } from 'firebase/firestore';

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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

// ====================================
// FEATURE DEFINITIONS (para subcategorías)
// ====================================

export type FeatureType = 'text' | 'number';

export interface FeatureDefinition {
  key: string;          // 'marca', 'ram', 'peso'
  label: string;        // 'Marca', 'RAM (GB)', 'Peso (kg)'
  type: FeatureType;    // 'text' | 'number'
  required: boolean;
  placeholder?: string; // 'Ej: Samsung, Apple'
  unit?: string;        // 'GB', 'kg', 'cm' (solo para type='number')
  order: number;        // 1, 2, 3...
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive: boolean;
  featureDefinitions: FeatureDefinition[];  // Campos personalizables
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  // Nota: Ya no se requiere categoryId ni categoryName porque la subcategoría está anidada bajo la categoría en Firestore
}

// ====================================
// PRODUCT (con valores de features)
// ====================================

export interface ProductFeatures {
  [key: string]: string | number;  // Valores tipados dinámicamente
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  sellerId: string;
  features: ProductFeatures;  // { marca: "Hisense", ram: 8 }
  stock: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
