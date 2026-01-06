import { db } from './firebase';
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
  doc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRole, UserStatus } from '@/shared/types';
import type { User, UserProfile, SellerProfile, CourierProfile } from '@/shared/types';
import { createBaseModel } from '@/shared/types/base';

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
  businessName?: string;
  businessType?: string;
  taxId?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  categories?: string;
}

async function createUser(formData: CreateUserInput): Promise<string> {
  try {
    const auth = getAuth();
    
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const uid = userCredential.user.uid;
    
    const userDoc = doc(db, COLLECTION_NAME, uid);
    
    const profile: UserProfile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      addresses: [],
      emailVerified: false,
      phoneVerified: false,
    };

    const data: Record<string, unknown> = {
      profile,
      roles: [formData.activeRole],
      activeRole: formData.activeRole,
      status: formData.status,
      ...createBaseModel(uid),
    };

    if (formData.activeRole === UserRole.COURIER) {
      const courierProfile: CourierProfile = {
        vehicleType: (formData.vehicleType as 'bike' | 'motorcycle' | 'car' | 'walking') ?? 'bike',
        vehiclePlate: formData.vehiclePlate,
        licenseNumber: formData.licenseNumber,
        isAvailable: true,
        rating: {
          average: 0,
          count: 0,
        },
        totalDeliveries: 0,
      };
      data.courierProfile = courierProfile;
    }

    if (formData.activeRole === UserRole.SELLER) {
      const sellerProfile: SellerProfile = {
        businessName: formData.businessName ?? '',
        businessType: formData.businessType ?? '',
        taxId: formData.taxId,
        businessAddress: { 
          id: '', 
          street: formData.businessAddress || '', 
          city: '', 
          state: '', 
          country: '', 
          isDefault: true 
        },
        businessPhone: formData.businessPhone ?? '',
        businessEmail: formData.businessEmail ?? '',
        businessLogo: '',
        isVerified: false,
        rating: {
          average: 0,
          count: 0,
        },
        totalSales: 0,
        categories: formData.categories ? formData.categories.split(',').map((c: string) => c.trim()) : [],
      };
      data.sellerProfile = sellerProfile;
    }

    await setDoc(userDoc, data);
    return uid;
  } catch (error) {
    console.error('Error creando usuario:', error);
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
      // Índice/ordenamiento:
      // - Esta query requiere el campo `createdAt`.
      // - Si en el futuro se agrega `where(...)` + `orderBy(...)`, Firestore puede pedir un índice compuesto.
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
    // Compatibilidad con llamadas existentes: reconstruye el cursor hasta la página solicitada.
    // Esto mantiene la UI actual sin depender de offset (no recomendado en Firestore).
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

      const updateData: Record<string, unknown> = {};

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
          sellerProfile.categories = formData.categories.split(',').map((c: string) => c.trim());
        }
        updateData.sellerProfile = sellerProfile;
      }

      if (formData.activeRole === UserRole.COURIER) {
        const courierProfile: Partial<CourierProfile> = {};
        if (formData.vehicleType) {
          courierProfile.vehicleType = formData.vehicleType as 'bike' | 'motorcycle' | 'car' | 'walking';
        }
        if (formData.vehiclePlate) courierProfile.vehiclePlate = formData.vehiclePlate;
        if (formData.licenseNumber) courierProfile.licenseNumber = formData.licenseNumber;
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
};
