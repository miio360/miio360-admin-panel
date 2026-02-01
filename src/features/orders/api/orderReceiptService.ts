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
import { db } from '@/shared/services/firebase';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';
import { RejectionReason } from '@/shared/types/payment';

const COLLECTION_NAME = 'order_receipts';

export const orderReceiptService = {
    async getAll(): Promise<OrderPaymentReceipt[]> {
        try {
            const q = query(collection(db, COLLECTION_NAME));
            const snapshot = await getDocs(q);
            const receipts = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as OrderPaymentReceipt[];

            return receipts.sort((a, b) => {
                const aTime = a.createdAt || 0;
                const bTime = b.createdAt || 0;
                return bTime - aTime;
            });
        } catch (error) {
            console.error('Error fetching order receipts:', error);
            throw new Error('No se pudieron cargar los comprobantes de pedidos');
        }
    },

    async getByStatus(status: OrderReceiptStatus): Promise<OrderPaymentReceipt[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('status', '==', status)
            );
            const snapshot = await getDocs(q);
            const receipts = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as OrderPaymentReceipt[];

            return receipts.sort((a, b) => {
                const aTime = a.createdAt || 0;
                const bTime = b.createdAt || 0;
                return bTime - aTime;
            });
        } catch (error) {
            console.error('Error fetching order receipts by status:', error);
            throw new Error('No se pudieron cargar los comprobantes de pedidos');
        }
    },

    async approve(id: string, userId: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                status: 'approved',
                approvedBy: userId,
                approvedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error approving order receipt:', error);
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
            });
        } catch (error) {
            console.error('Error rejecting order receipt:', error);
            throw new Error('No se pudo rechazar el comprobante');
        }
    }
};
