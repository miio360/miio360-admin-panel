import {
    collection,
    doc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    DocumentSnapshot,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/shared/services/firebase';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';
import { RejectionReason, REJECTION_REASON_LABELS } from '@/shared/types/payment';

const COLLECTION_NAME = 'order_receipts';
const DEFAULT_PAGE_SIZE = 10;

export interface PaginatedReceiptsResult {
    receipts: OrderPaymentReceipt[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
}

export const orderReceiptService = {
    /**
     * Fetches a paginated page of order receipts, ordered by createdAt desc.
     * Optionally filtered by status (server-side).
     */
    async getPaginated(
        pageSize: number = DEFAULT_PAGE_SIZE,
        cursor: DocumentSnapshot | null = null,
        status?: OrderReceiptStatus
    ): Promise<PaginatedReceiptsResult> {
        try {
            const constraints = [
                ...(status ? [where('status', '==', status)] : []),
                orderBy('createdAt', 'desc'),
                ...(cursor ? [startAfter(cursor)] : []),
                limit(pageSize + 1), // fetch one extra to know if there's a next page
            ];

            const q = query(collection(db, COLLECTION_NAME), ...constraints);
            const snapshot = await getDocs(q);

            const hasMore = snapshot.docs.length > pageSize;
            const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
            const lastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

            const receipts = docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as OrderPaymentReceipt[];

            return { receipts, lastDoc, hasMore };
        } catch (error) {
            console.error('Error fetching paginated order receipts:', error);
            throw new Error('No se pudieron cargar los comprobantes de pedidos');
        }
    },

    // ---- Legacy methods kept for backward compatibility ----

    async getAll(): Promise<OrderPaymentReceipt[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as OrderPaymentReceipt[];
        } catch (error) {
            console.error('Error fetching order receipts:', error);
            throw new Error('No se pudieron cargar los comprobantes de pedidos');
        }
    },

    async getByStatus(status: OrderReceiptStatus): Promise<OrderPaymentReceipt[]> {
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
            })) as OrderPaymentReceipt[];
        } catch (error) {
            console.error('Error fetching order receipts by status:', error);
            throw new Error('No se pudieron cargar los comprobantes de pedidos');
        }
    },

    /**
     * Approves a payment receipt by calling the confirmPayment Cloud Function.
     * This updates both the order and the receipt atomically, and sends notifications.
     */
    async approve(_receiptId: string, orderId: string): Promise<void> {
        try {
            const confirmPaymentFn = httpsCallable(functions, 'confirmPayment');
            const result = await confirmPaymentFn({ orderId });
            const data = result.data as { success: boolean; message?: string };
            if (!data.success) {
                throw new Error(data.message || 'Error al aprobar el comprobante');
            }
        } catch (error) {
            console.error('Error approving order receipt:', error);
            if (error instanceof Error) throw error;
            throw new Error('No se pudo aprobar el comprobante');
        }
    },

    /**
     * Rejects a payment receipt by calling the rejectPayment Cloud Function.
     * This reverts the order to RESERVED and notifies the client.
     */
    async reject(
        _receiptId: string,
        orderId: string,
        reason: RejectionReason,
        comment?: string
    ): Promise<void> {
        try {
            const rejectPaymentFn = httpsCallable(functions, 'rejectPayment');
            const reasonText = reason === 'other'
                ? (comment || REJECTION_REASON_LABELS.other)
                : REJECTION_REASON_LABELS[reason];

            const result = await rejectPaymentFn({ orderId, reason: reasonText });
            const data = result.data as { success: boolean; message?: string };
            if (!data.success) {
                throw new Error(data.message || 'Error al rechazar el comprobante');
            }
        } catch (error) {
            console.error('Error rejecting order receipt:', error);
            if (error instanceof Error) throw error;
            throw new Error('No se pudo rechazar el comprobante');
        }
    },

    // Kept for direct Firestore fallback if needed
    async approveLocal(id: string, userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: 'approved',
            approvedBy: userId,
            approvedAt: Timestamp.now(),
        });
    },

    async rejectLocal(id: string, userId: string, reason: RejectionReason, comment?: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: 'rejected',
            rejectedBy: userId,
            rejectedAt: Timestamp.now(),
            rejectionReason: reason,
            rejectionComment: comment || null,
        });
    },
};

