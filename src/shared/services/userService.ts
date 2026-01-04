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
} from 'firebase/firestore';
import { UserRole } from '@/shared/types';
import type { User, UserStatus } from '@/shared/types';

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
  workingZones?: string;
  isAvailable?: boolean;
  businessName?: string;
  businessType?: string;
  taxId?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  categories?: string;
  isVerified?: boolean;
}

interface UserDocument {
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  roles: UserRole[];
  activeRole: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: unknown;
  updatedAt: unknown;
  courierProfile?: {
    vehicleType: string;
    vehiclePlate: string;
    licenseNumber: string;
    workingZones: string[];
    isAvailable: boolean;
    rating: number;
    totalDeliveries: number;
  };
  sellerProfile?: {
    businessName: string;
    businessType: string;
    taxId: string;
    businessAddress: {
      id: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
    };
    businessPhone: string;
    businessEmail: string;
    businessLogo: string;
    isVerified: boolean;
    rating: number;
    totalSales: number;
    categories: string[];
  };
}

async function createUser(formData: CreateUserInput): Promise<string> {
  // Crea usuario en Auth y Firestore
  try {
    const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const auth = getAuth();
    // 1. Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const uid = userCredential.user.uid;
    // 2. Crear documento en Firestore
    const userDoc = doc(db, COLLECTION_NAME, uid);
    const data: UserDocument = {
      email: formData.email,
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      roles: [formData.activeRole],
      activeRole: formData.activeRole,
      status: formData.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: false,
      phoneVerified: false,
    };
    if (formData.activeRole === UserRole.COURIER) {
      data.courierProfile = {
        vehicleType: formData.vehicleType ?? '',
        vehiclePlate: formData.vehiclePlate || '',
        licenseNumber: formData.licenseNumber || '',
        workingZones: formData.workingZones ? formData.workingZones.split(',').map((z: string) => z.trim()) : [],
        isAvailable: !!formData.isAvailable,
        rating: 0,
        totalDeliveries: 0,
      };
    }
    if (formData.activeRole === UserRole.SELLER) {
      data.sellerProfile = {
        businessName: formData.businessName ?? '',
        businessType: formData.businessType ?? '',
        taxId: formData.taxId || '',
        businessAddress: { id: '', street: formData.businessAddress || '', city: '', state: '', zipCode: '', country: '', isDefault: true },
        businessPhone: formData.businessPhone ?? '',
        businessEmail: formData.businessEmail ?? '',
        businessLogo: '',
        isVerified: !!formData.isVerified,
        rating: 0,
        totalSales: 0,
        categories: formData.categories ? formData.categories.split(',').map((c: string) => c.trim()) : [],
      };
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
          email: data.email,
          profile: data.profile,
          roles: data.roles,
          activeRole: data.activeRole,
          status: data.status,
          addresses: data.addresses || [],
          sellerProfile: data.sellerProfile,
          courierProfile: data.courierProfile,
          createdAt: (data.createdAt ?? Timestamp.fromDate(new Date())) as Timestamp,
          updatedAt: (data.updatedAt ?? Timestamp.fromDate(new Date())) as Timestamp,
          lastLoginAt: (data.lastLoginAt as Timestamp | undefined) ?? undefined,
          emailVerified: !!data.emailVerified,
          phoneVerified: !!data.phoneVerified,
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
        email: data.email,
        profile: data.profile,
        roles: data.roles,
        activeRole: data.activeRole,
        status: data.status,
        addresses: data.addresses || [],
        sellerProfile: data.sellerProfile,
        courierProfile: data.courierProfile,
        createdAt: (data.createdAt ?? Timestamp.fromDate(new Date())) as Timestamp,
        updatedAt: (data.updatedAt ?? Timestamp.fromDate(new Date())) as Timestamp,
        lastLoginAt: (data.lastLoginAt as Timestamp | undefined) ?? undefined,
        emailVerified: !!data.emailVerified,
        phoneVerified: !!data.phoneVerified,
      };
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  },
  createUser,
};
