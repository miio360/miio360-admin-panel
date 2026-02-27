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

      const baseData = {
        receiptId: input.receiptId,
        seller: input.seller,
        planType: input.planType,
        planTitle: input.planTitle,
        planPrice: input.planPrice,
        status: 'pending_assignment' as const,
        approvedAt: now,
        ...createBaseModel(input.approvedBy),
      };

      let planSpecificData = {};

      if (input.planType === 'advertising') {
        planSpecificData = {
          advertisingType: input.advertisingType,
          advertisingPosition: input.advertisingPosition,
          daysEnabled: input.daysEnabled,
          daysUsed: 0,
          // bannerImage is required for store_banner plans; product plans may have it from productImage
          ...(input.bannerImage ? { bannerImage: input.bannerImage } : {}),
        };
      } else if (input.planType === 'video') {
        const videoData: Record<string, unknown> = {
          videoMode: input.videoMode,
        };

        if (input.videoMode === 'video_count') {
          videoData.videoCount = input.videoCount ?? 0;
          videoData.maxDurationPerVideoSeconds = input.maxDurationPerVideoSeconds ?? 0;
          videoData.videosUsed = 0;
        } else if (input.videoMode === 'time_pool') {
          videoData.totalDurationSeconds = input.totalDurationSeconds ?? 0;
          videoData.totalSecondsUsed = 0;
        }

        planSpecificData = videoData;
      } else if (input.planType === 'lives') {
        planSpecificData = {
          livesDurationMinutes: input.livesDurationMinutes,
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

  /**
   * Activa un plan de publicidad (establece fechas de inicio y fin)
   */
  async activateAdvertisingPlan(
    id: string,
    userId: string,
    startImmediately = true
  ): Promise<void> {
    try {
      const planDoc = await this.getById(id);
      if (!planDoc || planDoc.planType !== 'advertising') {
        throw new Error('Plan no encontrado o no es de tipo publicidad');
      }

      const now = Timestamp.now();
      const startDate = startImmediately ? now : planDoc.startDate || now;

      const startDateObj = startDate.toDate();
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(endDateObj.getDate() + planDoc.daysEnabled);
      const endDate = Timestamp.fromDate(endDateObj);

      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'active' as const,
        startDate,
        endDate,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error activating advertising plan:', error);
      throw new Error('No se pudo activar el plan de publicidad');
    }
  },

  /**
   * Programa un plan de publicidad para activarse en una fecha futura
   */
  async scheduleAdvertisingPlan(
    id: string,
    startDate: Timestamp,
    userId: string
  ): Promise<void> {
    try {
      const planDoc = await this.getById(id);
      if (!planDoc || planDoc.planType !== 'advertising') {
        throw new Error('Plan no encontrado o no es de tipo publicidad');
      }

      const startDateObj = startDate.toDate();
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(endDateObj.getDate() + planDoc.daysEnabled);
      const endDate = Timestamp.fromDate(endDateObj);

      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'scheduled' as const,
        startDate,
        endDate,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error scheduling advertising plan:', error);
      throw new Error('No se pudo programar el plan de publicidad');
    }
  },

  /**
   * Asigna un producto a un plan de publicidad de tipo product
   */
  async assignProductToAdvertisingPlan(
    id: string,
    productSummary: import('../types/summaries').ProductSummary,
    userId: string,
    activateImmediately = true
  ): Promise<void> {
    try {
      const planDoc = await this.getById(id);
      if (!planDoc || planDoc.planType !== 'advertising') {
        throw new Error('Plan no encontrado o no es de tipo publicidad');
      }

      if (planDoc.advertisingType !== 'product') {
        throw new Error('Solo se pueden asignar productos a planes de tipo producto');
      }

      const updateData: Record<string, unknown> = {
        assignedProduct: productSummary,
        ...updateModelTimestamp(userId),
      };

      if (activateImmediately) {
        const now = Timestamp.now();
        const endDateObj = new Date(now.toDate());
        endDateObj.setDate(endDateObj.getDate() + planDoc.daysEnabled);
        const endDate = Timestamp.fromDate(endDateObj);

        updateData.status = 'active' as const;
        updateData.startDate = now;
        updateData.endDate = endDate;
      } else {
        updateData.status = 'scheduled' as const;
      }

      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error assigning product to advertising plan:', error);
      throw new Error('No se pudo asignar el producto al plan');
    }
  },

  /**
   * Incrementa los dias usados de un plan de publicidad
   */
  async incrementDaysUsed(id: string): Promise<void> {
    try {
      const planDoc = await this.getById(id);
      if (!planDoc || planDoc.planType !== 'advertising') {
        throw new Error('Plan no encontrado o no es de tipo publicidad');
      }

      const newDaysUsed = planDoc.daysUsed + 1;
      const docRef = doc(db, COLLECTION_NAME, id);

      const updateData: Record<string, unknown> = {
        daysUsed: newDaysUsed,
      };

      if (newDaysUsed >= planDoc.daysEnabled) {
        updateData.status = 'expired' as const;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error incrementing days used:', error);
      throw new Error('No se pudo actualizar los dias usados');
    }
  },

  /**
   * Verifica y actualiza planes expirados
   */
  async checkAndExpirePlans(): Promise<void> {
    try {
      const activePlans = await this.getByStatus('active');
      const now = Timestamp.now();

      for (const plan of activePlans) {
        if (plan.planType === 'advertising' && plan.endDate) {
          if (plan.endDate.toMillis() <= now.toMillis()) {
            await this.updateStatus(plan.id, 'expired', 'system');
          }
        }
      }
    } catch (error) {
      console.error('Error checking expired plans:', error);
      throw new Error('No se pudieron verificar los planes expirados');
    }
  },
};
