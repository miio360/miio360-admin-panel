// Convierte Timestamp (Firestore), Date o string a Date seguro
export function getDateFromTimestamp(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  // Firestore Timestamp
  if (typeof value === 'object' && value !== null && typeof (value as any).toDate === 'function') {
    return (value as any).toDate();
  }
  return null;
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
