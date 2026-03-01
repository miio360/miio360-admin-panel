import { db, functions } from './firebase';
import {
  collection,
  getDocs,
  getCountFromServer,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { UserRole, UserStatus } from '@/shared/types';
import type { User } from '@/shared/types';
import { CreateUserResponse } from '@/shared/types/user';

const COLLECTION_NAME = 'users';

/** Minimal courier data needed for the assign-courier modal. */
export interface CourierSummary {
  id: string;
  fullName: string;
  phone: string;
  cities: string[];
  currentCity: string | null;
  isAvailable: boolean;
  totalDeliveries: number;
}

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  activeRole: UserRole;
  status: UserStatus;
  vehicleType?: string;
  vehiclePlate?: string;
  licenseNumber?: string;
  cities?: string[];
  currentCity?: string;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  categories?: string[] | string;
}

async function createUser(formData: CreateUserInput): Promise<string> {
  console.log('[Frontend] Llamando a Cloud Function createUser...');

  try {
    const createUserFn = httpsCallable<CreateUserInput, CreateUserResponse>(functions, 'createUser');

    const payload: CreateUserInput = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      activeRole: formData.activeRole,
      status: formData.status,
    };

    if (formData.activeRole === UserRole.SELLER) {
      payload.businessName = formData.businessName;
      payload.businessType = formData.businessType;
      payload.taxId = formData.taxId;
      payload.businessPhone = formData.businessPhone;
      payload.businessEmail = formData.businessEmail;
      payload.businessAddress = formData.businessAddress;

      if (typeof formData.categories === 'string') {
        payload.categories = formData.categories.split(',').map((c: string) => c.trim());
      } else {
        payload.categories = formData.categories || [];
      }
    }

    if (formData.activeRole === UserRole.COURIER) {
      payload.vehicleType = (formData.vehicleType as 'bike' | 'motorcycle' | 'car' | 'walking') ?? 'bike';
      payload.vehiclePlate = formData.vehiclePlate;
      payload.licenseNumber = formData.licenseNumber;
      payload.cities = formData.cities;
      payload.currentCity = formData.currentCity;
    }

    const result = await createUserFn(payload);
    const response = result.data;

    console.log('[Frontend] Respuesta de Cloud Function:', response);

    if (response.success && response.userId) {
      console.log('[Frontend] Usuario creado exitosamente:', response.userId);
      return response.userId;
    } else {
      console.error('[Frontend] Error al crear usuario:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('[Frontend] Error llamando a Cloud Function:', error);
    if (error instanceof Error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
    throw new Error('No se pudo crear el usuario');
  }
}

export const userService = {
  async getPage({
    pageSize = 6,
    cursor,
  }: {
    pageSize?: number;
    cursor?: QueryDocumentSnapshot<DocumentData> | null;
  } = {}): Promise<{ users: User[]; total: number; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      const usersRef = collection(db, COLLECTION_NAME);

      const baseQuery = query(usersRef, orderBy('createdAt', 'desc'), limit(pageSize));
      const q = cursor
        ? query(usersRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize))
        : baseQuery;

      const [snapshot, countSnap] = await Promise.all([
        getDocs(q),
        getCountFromServer(usersRef),
      ]);

      const users: User[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          profile: data.profile,
          roles: data.roles,
          activeRole: data.activeRole,
          status: data.status,
          sellerProfile: data.sellerProfile,
          courierProfile: data.courierProfile,
          createdAt: (data.createdAt ?? Timestamp.fromDate(new Date())) as Timestamp,
          updatedAt: (data.updatedAt ?? Timestamp.fromDate(new Date())) as Timestamp,
          createdBy: data.createdBy || 'unknown',
          lastLoginAt: (data.lastLoginAt as Timestamp | undefined) ?? undefined,
        };
      });

      const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
      return { users, total: countSnap.data().count, lastDoc };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('No se pudieron cargar los usuarios');
    }
  },

  async getAll(
    { page = 0, pageSize = 6 }: { page?: number; pageSize?: number } = {}
  ): Promise<{ users: User[]; total: number }> {

    let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

    for (let i = 0; i < page; i += 1) {
      const res = await this.getPage({ pageSize, cursor });
      cursor = res.lastDoc;
      if (!cursor) break;
    }

    const res = await this.getPage({ pageSize, cursor });
    return { users: res.users, total: res.total };
  },

  /**
   * Returns all active courier users for the assign-courier modal.
   * Sorted by fewest deliveries first.
   */
  async getCouriers(): Promise<CourierSummary[]> {
    try {
      const usersRef = collection(db, COLLECTION_NAME);
      const q = query(
        usersRef,
        where('activeRole', '==', UserRole.COURIER),
        where('status', '==', UserStatus.ACTIVE),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const firstName: string = d.profile?.firstName ?? '';
        const lastName: string = d.profile?.lastName ?? '';
        return {
          id: docSnap.id,
          fullName: `${firstName} ${lastName}`.trim() || 'Repartidor',
          phone: (d.profile?.phone as string | undefined) ?? '',
          cities: (d.courierProfile?.cities as string[] | undefined) ?? [],
          currentCity: (d.courierProfile?.currentCity as string | undefined) ?? null,
          isAvailable: (d.courierProfile?.isAvailable as boolean | undefined) ?? false,
          totalDeliveries: (d.courierProfile?.totalDeliveries as number | undefined) ?? 0,
        };
      });
    } catch (error) {
      console.error('Error fetching couriers:', error);
      throw new Error('No se pudieron cargar los repartidores');
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const data = docSnap.data();
      return {
        id: docSnap.id,
        profile: data.profile,
        roles: data.roles,
        activeRole: data.activeRole,
        status: data.status,
        sellerProfile: data.sellerProfile,
        courierProfile: data.courierProfile,
        createdAt: (data.createdAt ?? Timestamp.fromDate(new Date())) as Timestamp,
        updatedAt: (data.updatedAt ?? Timestamp.fromDate(new Date())) as Timestamp,
        createdBy: data.createdBy || 'unknown',
        lastLoginAt: (data.lastLoginAt as Timestamp | undefined) ?? undefined,
      };
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  },

  async updateUser(id: string, formData: Partial<CreateUserInput>): Promise<void> {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const userDoc = doc(db, COLLECTION_NAME, id);

      const updateData: Record<string, any> = {};

      if (formData.firstName) updateData['profile.firstName'] = formData.firstName;
      if (formData.lastName) updateData['profile.lastName'] = formData.lastName;
      if (formData.phone) updateData['profile.phone'] = formData.phone;
      if (formData.email) updateData['profile.email'] = formData.email;

      if (formData.activeRole) {
        updateData.activeRole = formData.activeRole;
        updateData.roles = [formData.activeRole];
      }

      if (formData.status) {
        updateData.status = formData.status;
      }

      if (formData.activeRole === UserRole.SELLER) {
        if (formData.businessName) updateData['sellerProfile.businessName'] = formData.businessName;
        if (formData.businessType) updateData['sellerProfile.businessType'] = formData.businessType;
        if (formData.taxId) updateData['sellerProfile.taxId'] = formData.taxId;
        if (formData.businessPhone) updateData['sellerProfile.businessPhone'] = formData.businessPhone;
        if (formData.businessEmail) updateData['sellerProfile.businessEmail'] = formData.businessEmail;
        if (formData.businessAddress) {
          updateData['sellerProfile.businessAddress'] = {
            id: '',
            street: formData.businessAddress,
            city: '',
            state: '',
            country: '',
            isDefault: true,
          };
        }
        if (formData.categories) {
          if (typeof formData.categories === 'string') {
            updateData['sellerProfile.categories'] = formData.categories.split(',').map((c: string) => c.trim());
          } else {
            updateData['sellerProfile.categories'] = formData.categories;
          }
        }
      }

      if (formData.activeRole === UserRole.COURIER) {
        if (formData.vehiclePlate) updateData['courierProfile.vehiclePlate'] = formData.vehiclePlate;
        if (formData.licenseNumber) updateData['courierProfile.licenseNumber'] = formData.licenseNumber;
        if (formData.cities !== undefined) updateData['courierProfile.cities'] = formData.cities;
        if (formData.currentCity !== undefined) updateData['courierProfile.currentCity'] = formData.currentCity;
        // Setear siempre en true al editar un repartidor
        updateData['courierProfile.isAvailable'] = true;
      }

      updateData.updatedAt = Timestamp.fromDate(new Date());

      await updateDoc(userDoc, updateData);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error('No se pudo actualizar el usuario');
    }
  },

  createUser,

  async deleteUser(uid: string): Promise<void> {
    try {
      const deleteUserFn = httpsCallable<{ uid: string }, { success: boolean; message: string }>(
        functions,
        'deleteUser'
      );
      const result = await deleteUserFn({ uid });
      if (!result.data.success) {
        throw new Error(result.data.message);
      }
    } catch (error) {
      console.error('[userService] Error deleting user:', error);
      if (error instanceof Error) {
        throw new Error(`Error al eliminar usuario: ${error.message}`);
      }
      throw new Error('No se pudo eliminar el usuario');
    }
  },
};
