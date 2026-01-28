import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { PaymentReceipt, PaymentReceiptStatus, RejectionReason } from '../types/payment';
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

  async approve(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status: 'approved',
        approvedBy: userId,
        approvedAt: Timestamp.now(),
        rejectionReason: null,
        rejectedBy: null,
        rejectedAt: null,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error approving payment receipt:', error);
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
