import { Timestamp } from 'firebase/firestore';
import { BaseModel, FileUploaded, Rating } from './base';

// User roles and types for ecommerce platform
export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  COURIER = 'courier',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isDefault: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: FileUploaded; //link  url profile picture
  dateOfBirth?: Timestamp;
  addresses: UserAddress[];
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface SellerProfile {
  businessName: string;
  businessType: string;  // e.g., "individual", "company"
  taxId?: string; // Número de identificación fiscal
  businessAddress: UserAddress; 
  businessPhone: string;
  businessEmail: string;
  businessLogo?: string;
  isVerified: boolean;
  verificationDate?: Timestamp;
  rating: Rating;
  totalSales: number;
  categories?: string[]; // Categorías seleccionadas por el vendedor
}

export interface CourierProfile {
  vehicleType: 'bike' | 'motorcycle' | 'car' | 'walking';
  vehiclePlate?: string;
  licenseNumber?: string;
  isAvailable: boolean;
  rating: Rating;
  totalDeliveries: number;
}

export interface User extends BaseModel {
  id: string;
  profile: UserProfile;
  roles: UserRole[];
  activeRole: UserRole;
  status: UserStatus;

  // Role-specific profiles
  sellerProfile?: SellerProfile;
  courierProfile?: CourierProfile;

  // Metadata
  lastLoginAt?: Timestamp;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

// Authentication DTOs
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  initialRole: UserRole;
}

export interface CreateUserResponse {
  success: boolean;
  userId?: string;
  message: string;
  code?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface UpdateProfileData {
  profile?: Partial<UserProfile>;
  sellerProfile?: Partial<SellerProfile>;
  courierProfile?: Partial<CourierProfile>;
}

export interface RoleChangeRequest {
  newRole: UserRole;
  additionalData?: SellerProfile | CourierProfile;
}
