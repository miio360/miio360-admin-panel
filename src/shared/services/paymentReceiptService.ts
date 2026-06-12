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
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import type { PaymentReceipt, PaymentReceiptStatus, RejectionReason } from '../types/payment';
import type { SellerSummary } from '../types/summaries';
import { updateModelTimestamp } from '../types/base';

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
   * Aprueba un comprobante de pago via Cloud Function.
   * La CF crea el active_plan, actualiza el receipt y envia notificacion al seller.
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
      const processPaymentReceiptFn = httpsCallable<{
        receiptId: string;
        adminId: string;
        sellerData: {
          id: string;
          name: string;
          profileImage?: string;
          storeName?: string;
        };
      }, { success: boolean; activePlanId?: string; message?: string }>(
        functions,
        'processPaymentReceipt',
      );

      const result = await processPaymentReceiptFn({
        receiptId: id,
        adminId: userId,
        sellerData: {
          id: sellerData.id,
          name: sellerData.name,
          profileImage: sellerData.profileImage || '',
          storeName: sellerData.storeName || sellerData.name,
        },
      });

      const response = result.data;

      if (!response.success || !response.activePlanId) {
        throw new Error(response.message || 'Error al aprobar');
      }

      return { activePlanId: response.activePlanId };
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
