import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import type { User } from '@/shared/types';

const COLLECTION_NAME = 'users';

async function createUser(formData: any): Promise<string> {
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
    const data: any = {
      email: formData.email,
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
      activeRole: formData.activeRole,
      status: formData.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: false,
      phoneVerified: false,
    };
    if (formData.activeRole === 'COURIER') {
      data.courierProfile = {
        vehicleType: formData.vehicleType,
        vehiclePlate: formData.vehiclePlate || '',
        licenseNumber: formData.licenseNumber || '',
        workingZones: formData.workingZones ? formData.workingZones.split(',').map((z: string) => z.trim()) : [],
        isAvailable: !!formData.isAvailable,
        rating: 0,
        totalDeliveries: 0,
      };
    }
    if (formData.activeRole === 'SELLER') {
      data.sellerProfile = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        taxId: formData.taxId || '',
        businessAddress: { id: '', street: formData.businessAddress || '', city: '', state: '', zipCode: '', country: '', isDefault: true },
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail,
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
  async getAll({ page = 0, pageSize = 10 }: { page?: number; pageSize?: number } = {}): Promise<{ users: User[]; total: number }> {
    try {
      const usersRef = collection(db, COLLECTION_NAME);
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(pageSize));
      const snapshot = await getDocs(q);
      // TODO: paginación real con startAfter
      const users: User[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          profile: data.profile,
          roles: data.roles,
          activeRole: data.activeRole,
          status: data.status,
          addresses: data.addresses || [],
          sellerProfile: data.sellerProfile,
          courierProfile: data.courierProfile,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
          lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : undefined,
          emailVerified: !!data.emailVerified,
          phoneVerified: !!data.phoneVerified,
        };
      });
      return { users, total: users.length };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('No se pudieron cargar los usuarios');
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
        email: data.email,
        profile: data.profile,
        roles: data.roles,
        activeRole: data.activeRole,
        status: data.status,
        addresses: data.addresses || [],
        sellerProfile: data.sellerProfile,
        courierProfile: data.courierProfile,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : undefined,
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
