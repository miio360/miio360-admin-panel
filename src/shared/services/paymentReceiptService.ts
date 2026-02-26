import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentReceipt, PaymentReceiptStatus, RejectionReason } from '../types/payment';
import type { AdvertisingPlanSummary, VideoPlanSummary, LivesPlanSummary, SellerSummary } from '../types/summaries';
import { updateModelTimestamp } from '../types/base';
import { activePlanService } from './activePlanService';

const COLLECTION_NAME = 'payment_receipts';

export const paymentReceiptService = {
  async getAll(): Promise<PaymentReceipt[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getDocs(q);
      const receipts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PaymentReceipt[];

      return receipts.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching payment receipts:', error);
      throw new Error('No se pudieron cargar los comprobantes');
    }
  },

  async getPaginated(
    limitCount: number,
    lastDoc?: any, // QueryDocumentSnapshot<DocumentData>,
    status?: PaymentReceiptStatus | 'all'
  ): Promise<{ receipts: PaymentReceipt[]; lastDoc: any }> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (status && status !== 'all') {
        q = query(
          collection(db, COLLECTION_NAME),
          where('status', '==', status),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const receipts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PaymentReceipt[];

      return {
        receipts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      console.error('Error fetching paginated receipts:', error);
      throw new Error('No se pudieron cargar los comprobantes paginados');
    }
  },

  async getByStatus(status: PaymentReceiptStatus): Promise<PaymentReceipt[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', status)
      );
      const snapshot = await getDocs(q);
      const receipts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PaymentReceipt[];

      return receipts.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching payment receipts by status:', error);
      throw new Error('No se pudieron cargar los comprobantes');
    }
  },

  async getById(id: string): Promise<PaymentReceipt | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as PaymentReceipt;
    } catch (error) {
      console.error('Error fetching payment receipt:', error);
      throw new Error('No se pudo cargar el comprobante');
    }
  },

  /**
   * Aprueba un comprobante de pago y crea el plan activo correspondiente
   * @param id - ID del comprobante
   * @param userId - ID del admin que aprueba
   * @param sellerData - Datos del vendedor para crear el plan activo
   */
  async approve(
    id: string,
    userId: string,
    sellerData: SellerSummary
  ): Promise<{ activePlanId: string }> {
    try {
      // 1. Obtener el receipt para acceder a los datos del plan
      const receipt = await this.getById(id);
      if (!receipt) {
        throw new Error('Comprobante no encontrado');
      }

      if (receipt.status !== 'pending') {
        throw new Error('El comprobante ya fue procesado');
      }

      // 2. Crear el active_plan segun el tipo de plan
      const plan = receipt.plan;
      let activePlanId: string;

      if (plan.planType === 'advertising') {
        const advertisingPlan = plan as AdvertisingPlanSummary;

        // Banner required for:
        // - store_banner plans (Plans 1 & 2): promotional store banner
        // - product + mini_banner (Plan 5): static product banner between product rows
        const requiresBanner =
          advertisingPlan.advertisingType === 'store_banner' ||
          (advertisingPlan.advertisingType === 'product' &&
            advertisingPlan.advertisingPosition === 'mini_banner');

        if (requiresBanner && !receipt.bannerImage) {
          const label =
            advertisingPlan.advertisingType === 'store_banner'
              ? 'Banner de Tienda'
              : 'Banner de Producto';
          throw new Error(`El ${label} es requerido para este plan de publicidad`);
        }

        // Resolve the creative image: banner if present, productImage as fallback
        const creativeImage = receipt.bannerImage ?? receipt.productImage;

        activePlanId = await activePlanService.create({
          receiptId: id,
          seller: sellerData,
          planType: 'advertising',
          planTitle: plan.title,
          planPrice: plan.price,
          approvedBy: userId,
          advertisingType: advertisingPlan.advertisingType,
          advertisingPosition: advertisingPlan.advertisingPosition,
          daysEnabled: advertisingPlan.daysEnabled,
          ...(creativeImage ? { bannerImage: creativeImage } : {}),
        });
      } else if (plan.planType === 'video') {
        const videoPlan = plan as VideoPlanSummary;
        activePlanId = await activePlanService.create({
          receiptId: id,
          seller: sellerData,
          planType: 'video',
          planTitle: plan.title,
          planPrice: plan.price,
          approvedBy: userId,
          videoMode: videoPlan.videoMode,
          videoCount: videoPlan.videoCount,
          maxDurationPerVideoSeconds: videoPlan.maxDurationPerVideoSeconds,
          totalDurationSeconds: videoPlan.totalDurationSeconds,
        });
      } else {
        const livesPlan = plan as LivesPlanSummary;
        activePlanId = await activePlanService.create({
          receiptId: id,
          seller: sellerData,
          planType: 'lives',
          planTitle: plan.title,
          planPrice: plan.price,
          approvedBy: userId,
          livesDurationMinutes: livesPlan.livesDurationMinutes,
        });
      }

      // 3. Actualizar el receipt con estado aprobado y referencia al plan
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'approved',
        approvedBy: userId,
        approvedAt: Timestamp.now(),
        activePlanId: activePlanId,
        rejectionReason: null,
        rejectedBy: null,
        rejectedAt: null,
        ...updateModelTimestamp(userId),
      });

      return { activePlanId };
    } catch (error) {
      console.error('Error approving payment receipt:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No se pudo aprobar el comprobante');
    }
  },

  async reject(id: string, userId: string, reason: RejectionReason, comment?: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'rejected',
        rejectedBy: userId,
        rejectedAt: Timestamp.now(),
        rejectionReason: reason,
        rejectionComment: comment || null,
        approvedBy: null,
        approvedAt: null,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error rejecting payment receipt:', error);
      throw new Error('No se pudo rechazar el comprobante');
    }
  },
};
