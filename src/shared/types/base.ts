
import { Timestamp, serverTimestamp } from 'firebase/firestore';

// ========== INTERFACES ==========

export interface BaseModel {
  id: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy?: string;
  deletedAt?: Timestamp | null;
  deletedBy?: string | null;
  isDeleted?: boolean;
}

export interface VisibilityModel {
  isVisible: boolean;
  hiddenAt?: Timestamp | null;
  hiddenBy?: string | null;
}

// ========== HELPERS (sin tipos de retorno) ==========

export function createBaseModel(userId: string) {
  return {
    createdAt: serverTimestamp(),
    createdBy: userId,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
    isDeleted: false,
  };
}

export function updateModelTimestamp(userId: string) {
  return {
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  };
}

export function softDeleteModel(userId: string) {
  return {
    deletedAt: serverTimestamp(),
    deletedBy: userId,
    isDeleted: true,
  };
}

export function restoreModel() {
  return {
    deletedAt: null,
    deletedBy: null,
    isDeleted: false,
  };
}

export function hideModel(userId: string) {
  return {
    isVisible: false,
    hiddenAt: serverTimestamp(),
    hiddenBy: userId,
  };
}

export function showModel() {
  return {
    isVisible: true,
    hiddenAt: null,
    hiddenBy: null,
  };
}

// ========== OTROS TIPOS ==========

export interface FileUploaded {
  url: string;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface Rating {
  average: number;
  count: number;
  distribution?: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CustomLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}
