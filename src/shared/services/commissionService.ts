import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CommissionPriceSettings, CommissionHistoryEntry } from '../types/settings';

const COLLECTION = 'app_settings';
const DOC_ID = 'commission_price';
const HISTORY_SUBCOLLECTION = 'history';

/**
 * Maps Firestore raw data (legacy field names with hyphens/underscores)
 * to our TypeScript interface.
 *
 * Firestore field  → TypeScript field
 * "app-service"    → appService
 * "seller_service" → sellerService
 * "courier_service"→ courierService
 */
function fromFirestore(data: Record<string, unknown>): CommissionPriceSettings {
    return {
        appService: (data['app-service'] as number) ?? 0,
        sellerService: (data['seller_service'] as number) ?? 0,
        courierService: (data['courier_service'] as number) ?? 0,
        updatedAt: data['updatedAt'] as CommissionPriceSettings['updatedAt'],
        updatedBy: data['updatedBy'] as string | undefined,
    };
}

export const commissionService = {
    /**
     * Reads the current commission configuration from Firestore.
     * Returns null if the document does not yet exist.
     */
    async get(): Promise<CommissionPriceSettings | null> {
        try {
            const ref = doc(db, COLLECTION, DOC_ID);
            const snap = await getDoc(ref);
            if (!snap.exists()) return null;
            return fromFirestore(snap.data() as Record<string, unknown>);
        } catch (error) {
            console.error('[commissionService] Error fetching commissions:', error);
            throw new Error('No se pudo cargar la configuración de comisiones');
        }
    },

    /**
     * Persists the commission values to Firestore and appends a history entry.
     * Field names are written exactly as the cloud functions expect them.
     */
    async update(
        values: CommissionPriceSettings,
        userId: string,
        userName: string,
        notes?: string
    ): Promise<void> {
        try {
            const ref = doc(db, COLLECTION, DOC_ID);

            // Write using legacy field names so existing cloud functions keep working
            await setDoc(
                ref,
                {
                    'app-service': values.appService,
                    'seller_service': values.sellerService,
                    'courier_service': values.courierService,
                    updatedAt: serverTimestamp(),
                    updatedBy: userId,
                },
                { merge: true }
            );

            // Append history entry in sub-collection
            const historyRef = collection(db, COLLECTION, DOC_ID, HISTORY_SUBCOLLECTION);
            await addDoc(historyRef, {
                appService: values.appService,
                sellerService: values.sellerService,
                courierService: values.courierService,
                changedAt: serverTimestamp(),
                changedBy: userId,
                changedByName: userName,
                notes: notes?.trim() || null,
            });
        } catch (error) {
            console.error('[commissionService] Error updating commissions:', error);
            throw new Error('No se pudo guardar la configuración de comisiones');
        }
    },

    /**
     * Returns the last N history entries, most recent first.
     */
    async getHistory(limitCount = 20): Promise<CommissionHistoryEntry[]> {
        try {
            const historyRef = collection(db, COLLECTION, DOC_ID, HISTORY_SUBCOLLECTION);
            const q = query(historyRef, orderBy('changedAt', 'desc'), limit(limitCount));
            const snap = await getDocs(q);
            return snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as CommissionHistoryEntry[];
        } catch (error) {
            console.error('[commissionService] Error fetching history:', error);
            throw new Error('No se pudo cargar el historial de comisiones');
        }
    },
};
