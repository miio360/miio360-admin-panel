import { db, functions } from './firebase';
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { UserRole, UserStatus } from '@/shared/types';
import type { User, UserProfile, SellerProfile, CourierProfile } from '@/shared/types';
import { CreateUserResponse } from '@/shared/types/user';

const COLLECTION_NAME = 'users';

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

      const updateData: UpdateData<DocumentData> = {};

      if (formData.firstName || formData.lastName || formData.phone || formData.email) {
        const profile: Partial<UserProfile> = {};
        if (formData.firstName) profile.firstName = formData.firstName;
        if (formData.lastName) profile.lastName = formData.lastName;
        if (formData.phone) profile.phone = formData.phone;
        if (formData.email) profile.email = formData.email;
        updateData.profile = profile;
      }

      if (formData.activeRole) {
        updateData.activeRole = formData.activeRole;
        updateData.roles = [formData.activeRole];
      }

      if (formData.status) {
        updateData.status = formData.status;
      }

      if (formData.activeRole === UserRole.SELLER) {
        const sellerProfile: Partial<SellerProfile> = {};
        if (formData.businessName) sellerProfile.businessName = formData.businessName;
        if (formData.businessType) sellerProfile.businessType = formData.businessType;
        if (formData.taxId) sellerProfile.taxId = formData.taxId;
        if (formData.businessPhone) sellerProfile.businessPhone = formData.businessPhone;
        if (formData.businessEmail) sellerProfile.businessEmail = formData.businessEmail;
        if (formData.businessAddress) {
          sellerProfile.businessAddress = {
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
            sellerProfile.categories = formData.categories.split(',').map((c: string) => c.trim());
          } else {
            sellerProfile.categories = formData.categories;
          }
        }
        updateData.sellerProfile = sellerProfile;
      }

      if (formData.activeRole === UserRole.COURIER) {
        const courierProfile: Partial<CourierProfile> = {};
        if (formData.vehiclePlate) courierProfile.vehiclePlate = formData.vehiclePlate;
        if (formData.licenseNumber) courierProfile.licenseNumber = formData.licenseNumber;
        if (formData.cities !== undefined) courierProfile.cities = formData.cities;
        if (formData.currentCity !== undefined) courierProfile.currentCity = formData.currentCity;
        updateData.courierProfile = courierProfile;
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
