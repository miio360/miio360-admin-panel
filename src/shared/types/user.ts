import { FileUploaded, Rating } from './base';

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
  zipCode: string;
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
  avatar?: FileUploaded; //link  url profile picture
  dateOfBirth?: Date;
}

export interface SellerProfile {
  businessName: string;
  businessType: string;
  taxId?: string;
  businessAddress: UserAddress;
  businessPhone: string;
  businessEmail: string;
  businessLogo?: string;
  isVerified: boolean;
  verificationDate?: Date;
  rating: Rating;
  totalSales: number;
  categories?: string[]; // Categorías seleccionadas por el vendedor
}

export interface CourierProfile {
  vehicleType: 'bike' | 'motorcycle' | 'car' | 'walking';
  vehiclePlate?: string;
  licenseNumber?: string;
  workingZones: string[];
  isAvailable: boolean;
  rating: number;
  totalDeliveries: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdate: Date;
  };
}

export interface User {
  id: string;
  email: string;
  profile: UserProfile;
  roles: UserRole[];
  activeRole: UserRole;
  status: UserStatus;
  addresses: UserAddress[];

  // Role-specific profiles
  sellerProfile?: SellerProfile;
  courierProfile?: CourierProfile;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface SerializedUser extends Omit<User, 'createdAt' | 'updatedAt' | 'lastLoginAt'> {
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthState {
  user: SerializedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
