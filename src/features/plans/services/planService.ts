import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import {
  createBaseModel,
  updateModelTimestamp,
  softDeleteModel,
} from '@/shared/types/base';
import type {
  Plan,
  PlanType,
  VideoPlan,
  AdvertisingPlan,
  LivesPlan,
  VideoPlanFormData,
  AdvertisingPlanFormData,
  LivesPlanFormData,
} from '../types/plan';
import { isValidAdvertisingCombination } from '../utils/advertisingValidation';

const COLLECTION_NAME = 'plans';
const PAGE_SIZE = 6;

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const planService = {
  async getAll(): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Plan[];
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw new Error('No se pudieron cargar los planes');
    }
  },

  async getByType(planType: PlanType): Promise<Plan[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('planType', '==', planType),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Plan[];
    } catch (error) {
      console.error('Error fetching plans by type:', error);
      throw new Error('No se pudieron cargar los planes');
    }
  },

  async getByTypePaginated(
    planType: PlanType,
    page: number,
    lastDocument?: QueryDocumentSnapshot<DocumentData> | null
  ): Promise<PaginatedResult<Plan>> {
    try {
      // Obtener conteo total
      const countQuery = query(
        collection(db, COLLECTION_NAME),
        where('planType', '==', planType),
        where('isDeleted', '==', false)
      );
      const countSnapshot = await getCountFromServer(countQuery);
      const totalCount = countSnapshot.data().count;
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);

      // Query paginado
      let paginatedQuery;
      if (page === 1 || !lastDocument) {
        paginatedQuery = query(
          collection(db, COLLECTION_NAME),
          where('planType', '==', planType),
          where('isDeleted', '==', false),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        );
      } else {
        paginatedQuery = query(
          collection(db, COLLECTION_NAME),
          where('planType', '==', planType),
          where('isDeleted', '==', false),
          orderBy('createdAt', 'desc'),
          startAfter(lastDocument),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(paginatedQuery);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Plan[];

      const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      const hasMore = page < totalPages;

      return {
        data,
        totalCount,
        totalPages,
        lastDoc,
        hasMore,
      };
    } catch (error) {
      console.error('Error fetching paginated plans:', error);
      throw new Error('No se pudieron cargar los planes');
    }
  },

  async getById(id: string): Promise<Plan | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Plan;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw new Error('No se pudo cargar el plan');
    }
  },

  async createVideoPlan(
    data: VideoPlanFormData,
    userId: string
  ): Promise<VideoPlan> {
    try {
      // Construir datos base
      const basePlanData = {
        title: data.title,
        description: data.description,
        price: data.price,
        isActive: data.isActive,
        videoMode: data.videoMode,
        planType: 'video' as const,
        deletedAt: null,
        deletedBy: null,
        ...createBaseModel(userId),
      };

      // Agregar campos segun modalidad (evitamos undefined que Firestore rechaza)
      let planData;
      if (data.videoMode === 'video_count') {
        planData = {
          ...basePlanData,
          videoCount: data.videoCount ?? 0,
          maxDurationPerVideoSeconds: data.maxDurationPerVideoSeconds ?? 0,
        };
      } else {
        planData = {
          ...basePlanData,
          totalDurationSeconds: data.totalDurationSeconds ?? 0,
        };
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), planData);
      return { id: docRef.id, ...planData } as unknown as VideoPlan;
    } catch (error) {
      console.error('Error creating video plan:', error);
      throw new Error('No se pudo crear el plan de video');
    }
  },

  async createAdvertisingPlan(
    data: AdvertisingPlanFormData,
    userId: string
  ): Promise<AdvertisingPlan> {
    try {
      if (!isValidAdvertisingCombination(data.advertisingType, data.advertisingPosition)) {
        throw new Error(
          'Combinacion invalida de tipo y posicionamiento de publicidad'
        );
      }

      const planData = {
        ...data,
        planType: 'advertising' as const,
        deletedAt: null,
        deletedBy: null,
        ...createBaseModel(userId),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), planData);
      return { id: docRef.id, ...planData } as unknown as AdvertisingPlan;
    } catch (error) {
      console.error('Error creating advertising plan:', error);
      throw new Error('No se pudo crear el plan de publicidad');
    }
  },

  async createLivesPlan(
    data: LivesPlanFormData,
    userId: string
  ): Promise<LivesPlan> {
    try {
      const planData = {
        ...data,
        planType: 'lives' as const,
        deletedAt: null,
        deletedBy: null,
        ...createBaseModel(userId),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), planData);
      return { id: docRef.id, ...planData } as unknown as LivesPlan;
    } catch (error) {
      console.error('Error creating lives plan:', error);
      throw new Error('No se pudo crear el plan de lives');
    }
  },

  async update(id: string, data: Partial<Plan>, userId?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      // Filtrar propiedades undefined para evitar error de Firestore
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
      );
      await updateDoc(docRef, {
        ...cleanData,
        ...(userId ? updateModelTimestamp(userId) : {}),
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      throw new Error('No se pudo actualizar el plan');
    }
  },

  async updateVideoPlan(
    id: string,
    data: VideoPlanFormData,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      // Construir datos base
      const baseUpdateData = {
        title: data.title,
        description: data.description,
        price: data.price,
        isActive: data.isActive,
        videoMode: data.videoMode,
        ...updateModelTimestamp(userId),
      };

      // Agregar campos segun modalidad
      let updateData;
      if (data.videoMode === 'video_count') {
        updateData = {
          ...baseUpdateData,
          videoCount: data.videoCount ?? 0,
          maxDurationPerVideoSeconds: data.maxDurationPerVideoSeconds ?? 0,
          // Limpiar campos de la otra modalidad
          totalDurationSeconds: null,
        };
      } else {
        updateData = {
          ...baseUpdateData,
          totalDurationSeconds: data.totalDurationSeconds ?? 0,
          // Limpiar campos de la otra modalidad
          videoCount: null,
          maxDurationPerVideoSeconds: null,
        };
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating video plan:', error);
      throw new Error('No se pudo actualizar el plan de video');
    }
  },

  async toggleActive(id: string, isActive: boolean, userId?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isActive,
        ...(userId ? updateModelTimestamp(userId) : {}),
      });
    } catch (error) {
      console.error('Error toggling plan status:', error);
      throw new Error('No se pudo cambiar el estado del plan');
    }
  },

  async softDelete(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...softDeleteModel(userId),
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw new Error('No se pudo eliminar el plan');
    }
  },
};
