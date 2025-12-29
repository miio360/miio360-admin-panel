import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import type { User } from '@/shared/types';

const COLLECTION_NAME = 'users';

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
};
