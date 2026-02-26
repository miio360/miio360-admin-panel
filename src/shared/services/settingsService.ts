import {
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { createBaseModel, updateModelTimestamp } from '../types/base';
import type { AppSettings, TechSupportSettings } from '../types/settings';

const COLLECTION = 'app_settings';
const DOC_ID = 'technical_support';

/**
 * Settings service — singleton document pattern.
 * Firestore path: app_settings/technical_support
 *
 * The MIIO mobile app reads `techSupport.whatsapp` from this same document
 * to build the WhatsApp deep-link on the user profile screen.
 */
export const settingsService = {
    async get(): Promise<AppSettings | null> {
        try {
            const ref = doc(db, COLLECTION, DOC_ID);
            const snap = await getDoc(ref);
            if (!snap.exists()) return null;
            return { id: snap.id, ...snap.data() } as AppSettings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw new Error('No se pudo cargar la configuración');
        }
    },

    async upsertTechSupport(
        techSupport: TechSupportSettings,
        userId: string
    ): Promise<void> {
        try {
            const ref = doc(db, COLLECTION, DOC_ID);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                // Create full document using BaseModel helpers — same as other services
                await setDoc(ref, {
                    id: DOC_ID,
                    techSupport,
                    ...createBaseModel(userId),
                });
            } else {
                // Partial merge — only update techSupport + timestamps
                await setDoc(
                    ref,
                    {
                        techSupport,
                        ...updateModelTimestamp(userId),
                    },
                    { merge: true }
                );
            }
        } catch (error) {
            console.error('Error saving tech support settings:', error);
            throw new Error('No se pudo guardar la configuración de soporte');
        }
    },
};
