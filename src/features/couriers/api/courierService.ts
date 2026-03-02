import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
  doc,
  updateDoc,
  type FieldValue,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db, functions } from '@/shared/services/firebase';
import { httpsCallable } from 'firebase/functions';
import { UserRole, UserStatus } from '@/shared/types';
import type { User } from '@/shared/types';
import type { CreateUserResponse } from '@/shared/types/user';

const COLLECTION = 'users';

export interface CreateCourierInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  vehiclePlate?: string;
  licenseNumber?: string;
  status: UserStatus;
  cities?: string[];
  currentCity?: string;
}

export interface UpdateCourierInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  vehiclePlate?: string;
  licenseNumber?: string;
  status?: UserStatus;
  cities?: string[];
  currentCity?: string;
}

/** Query and paginate users with activeRole === 'courier'. */
export async function getCouriersPage({
  pageSize = 10,
  cursor,
}: {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{ couriers: User[]; total: number; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const usersRef = collection(db, COLLECTION);

  const baseConstraints = [
    where('activeRole', '==', UserRole.COURIER),
    orderBy('createdAt', 'desc'),
    limit(pageSize),
  ] as const;

  const q = cursor
    ? query(usersRef, ...baseConstraints.slice(0, -1), startAfter(cursor), limit(pageSize))
    : query(usersRef, ...baseConstraints);

  const countQ = query(usersRef, where('activeRole', '==', UserRole.COURIER));

  const [snapshot, countSnap] = await Promise.all([
    getDocs(q),
    getCountFromServer(countQ),
  ]);

  const couriers: User[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      profile: data.profile,
      roles: data.roles,
      activeRole: data.activeRole,
      status: data.status,
      courierProfile: data.courierProfile,
      createdAt: (data.createdAt ?? Timestamp.fromDate(new Date())) as Timestamp,
      updatedAt: (data.updatedAt ?? Timestamp.fromDate(new Date())) as Timestamp,
      createdBy: data.createdBy || 'unknown',
    };
  });

  const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
  return { couriers, total: countSnap.data().count, lastDoc };
}

/** Create a courier via the existing createUser cloud function. */
export async function createCourier(input: CreateCourierInput): Promise<string> {
  const createUserFn = httpsCallable<Record<string, unknown>, CreateUserResponse>(
    functions,
    'createUser'
  );

  const result = await createUserFn({
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    activeRole: UserRole.COURIER,
    status: input.status,
    vehiclePlate: input.vehiclePlate,
    licenseNumber: input.licenseNumber,
    cities: input.cities,
    currentCity: input.currentCity,
  });

  const response = result.data;
  if (response.success && response.userId) return response.userId;
  throw new Error(response.message);
}

/** Update basic courier data and courierProfile fields in Firestore using dot notation to avoid overwriting nested objects. */
export async function updateCourier(id: string, input: UpdateCourierInput): Promise<void> {
  const userDoc = doc(db, COLLECTION, id);

  const updateData: Record<string, FieldValue | Partial<unknown> | undefined> = {
    updatedAt: Timestamp.fromDate(new Date()),
  };

  if (input.firstName !== undefined) updateData['profile.firstName'] = input.firstName;
  if (input.lastName !== undefined) updateData['profile.lastName'] = input.lastName;
  if (input.phone !== undefined) updateData['profile.phone'] = input.phone;

  if (input.status !== undefined) updateData.status = input.status;

  if (input.vehiclePlate !== undefined) updateData['courierProfile.vehiclePlate'] = input.vehiclePlate;
  if (input.licenseNumber !== undefined) updateData['courierProfile.licenseNumber'] = input.licenseNumber;
  if (input.cities !== undefined) updateData['courierProfile.cities'] = input.cities;
  if (input.currentCity !== undefined) updateData['courierProfile.currentCity'] = input.currentCity;

  await updateDoc(userDoc, updateData);
}
