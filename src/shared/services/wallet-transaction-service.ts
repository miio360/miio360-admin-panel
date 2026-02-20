import { httpsCallable } from 'firebase/functions';
import { collectionGroup, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, functions } from '@/shared/services/firebase';
import { WalletTransaction } from '../types/wallet';

const WALLET_TRANSACTIONS_COLLECTION_GROUP = 'wallet_transactions';

// Cloud Function callable
const processWalletTransactionFn = httpsCallable(functions, 'processWalletTransaction');

export const walletTransactionService = {
    /**
     * Fetch all purchase transactions across all users
     */
    getAllPurchases: async (): Promise<WalletTransaction[]> => {
        try {
            const q = query(
                collectionGroup(db, WALLET_TRANSACTIONS_COLLECTION_GROUP),
                where('type', '==', 'purchase'),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as WalletTransaction[];
        } catch (error) {
            console.error('Error fetching wallet transactions:', error);
            throw new Error('Failed to fetch wallet transactions');
        }
    },

    /**
     * Approve a transaction by calling the Cloud Function
     */
    approve: async (userId: string, transactionId: string, adminId: string): Promise<void> => {
        try {
            const result = await processWalletTransactionFn({
                userId,
                transactionId,
                action: 'approve',
                adminId,
            });

            const response = result.data as { success: boolean; message?: string };

            if (!response.success) {
                throw new Error(response.message || 'Error al aprobar la transacción');
            }
        } catch (error) {
            console.error('Error approving transaction:', error);
            throw error;
        }
    },

    /**
     * Reject a transaction by calling the Cloud Function
     */
    reject: async (userId: string, transactionId: string, adminId: string, reason: string): Promise<void> => {
        try {
            const result = await processWalletTransactionFn({
                userId,
                transactionId,
                action: 'reject',
                adminId,
                rejectionReason: reason,
            });

            const response = result.data as { success: boolean; message?: string };

            if (!response.success) {
                throw new Error(response.message || 'Error al rechazar la transacción');
            }
        } catch (error) {
            console.error('Error rejecting transaction:', error);
            throw error;
        }
    }
};
