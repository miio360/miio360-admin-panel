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
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { createBaseModel, updateModelTimestamp } from '../types/base';
import type {
  ActivePlan,
  ActivePlanStatus,
  CreateActivePlanInput,
} from '../types/active-plan';

const COLLECTION_NAME = 'active_plans';

export const activePlanService = {
  /**
   * Obtiene todos los planes activos
   */
  async getAll(): Promise<ActivePlan[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ActivePlan[];
    } catch (error) {
      console.error('Error fetching active plans:', error);
      throw new Error('No se pudieron cargar los planes activos');
    }
  },

  /**
   * Obtiene planes activos por estado
   */
  async getByStatus(status: ActivePlanStatus): Promise<ActivePlan[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ActivePlan[];
    } catch (error) {
      console.error('Error fetching active plans by status:', error);
      throw new Error('No se pudieron cargar los planes activos');
    }
  },

  /**
   * Obtiene planes activos de un vendedor especifico
   */
  async getBySellerId(sellerId: string): Promise<ActivePlan[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('seller.id', '==', sellerId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ActivePlan[];
    } catch (error) {
      console.error('Error fetching active plans by seller:', error);
      throw new Error('No se pudieron cargar los planes del vendedor');
    }
  },

  /**
   * Obtiene un plan activo por ID
   */
  async getById(id: string): Promise<ActivePlan | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as ActivePlan;
    } catch (error) {
      console.error('Error fetching active plan:', error);
      throw new Error('No se pudo cargar el plan activo');
    }
  },

  /**
   * Obtiene un plan activo por receiptId
   */
  async getByReceiptId(receiptId: string): Promise<ActivePlan | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('receiptId', '==', receiptId)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as ActivePlan;
    } catch (error) {
      console.error('Error fetching active plan by receipt:', error);
      throw new Error('No se pudo cargar el plan activo');
    }
  },

  /**
   * Crea un nuevo plan activo (llamado al aprobar un receipt)
   */
  async create(input: CreateActivePlanInput): Promise<string> {
    try {
      const now = Timestamp.now();

      // Datos base para todos los planes
      const baseData = {
        receiptId: input.receiptId,
        seller: input.seller,
        planType: input.planType,
        planTitle: input.planTitle,
        planPrice: input.planPrice,
        status: 'pending_assignment' as const,
        approvedAt: now,
        approvedBy: input.approvedBy,
        ...createBaseModel(input.approvedBy),
      };

      // Datos especificos segun tipo de plan
      let planSpecificData = {};

      if (input.planType === 'advertising') {
        planSpecificData = {
          advertisingType: input.advertisingType,
          daysEnabled: input.daysEnabled ?? 0,
          daysUsed: 0,
          bannerImage: input.bannerImage ?? null,
        };
      } else if (input.planType === 'video') {
        planSpecificData = {
          videoCount: input.videoCount ?? 0,
          videoDurationMinutes: input.videoDurationMinutes ?? 0,
          videosUsed: 0,
        };
      } else if (input.planType === 'lives') {
        planSpecificData = {
          livesDurationMinutes: input.livesDurationMinutes ?? 0,
          livesUsed: 0,
        };
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...baseData,
        ...planSpecificData,
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating active plan:', error);
      throw new Error('No se pudo crear el plan activo');
    }
  },

  /**
   * Actualiza el estado de un plan activo
   */
  async updateStatus(
    id: string,
    status: ActivePlanStatus,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error updating active plan status:', error);
      throw new Error('No se pudo actualizar el estado del plan');
    }
  },

  /**
   * Cancela un plan activo
   */
  async cancel(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'cancelled' as const,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error cancelling active plan:', error);
      throw new Error('No se pudo cancelar el plan');
    }
  },
};
