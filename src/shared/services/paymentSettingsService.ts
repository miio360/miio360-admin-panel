import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type { PaymentSettings } from '../types/payment';
import type { PlanType } from '@/features/plans/types/plan';
import { createBaseModel, updateModelTimestamp, softDeleteModel } from '../types/base';

const COLLECTION_NAME = 'payment_settings';

export const paymentSettingsService = {
  async getAll(): Promise<PaymentSettings[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('isDeleted', '==', false)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PaymentSettings[];
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      throw new Error('No se pudo cargar la configuración de QR');
    }
  },

  async getByPlanType(planType: PlanType): Promise<PaymentSettings | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('planType', '==', planType),
        where('isDeleted', '==', false)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as PaymentSettings;
    } catch (error) {
      console.error('Error fetching QR by plan type:', error);
      throw new Error('No se pudo cargar el QR');
    }
  },

  async create(
    planType: PlanType,
    file: File,
    userId: string
  ): Promise<PaymentSettings> {
    try {
      const existingQRs = query(
        collection(db, COLLECTION_NAME),
        where('planType', '==', planType),
        where('isDeleted', '==', false)
      );
      const existingSnapshot = await getDocs(existingQRs);

      for (const docSnap of existingSnapshot.docs) {
        await updateDoc(doc(db, COLLECTION_NAME, docSnap.id), {
          isActive: false,
          ...updateModelTimestamp(userId),
        });
      }

      const timestamp = Date.now();
      const storagePath = `payment/${planType}_${timestamp}.jpg`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const qrImage = {
        url: downloadURL,
        name: file.name,
        path: storagePath,
        size: file.size,
        type: file.type,
      };

      const data = {
        planType,
        qrImage,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
        ...createBaseModel(userId),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return { id: docRef.id, ...data } as unknown as PaymentSettings;
    } catch (error) {
      console.error('Error creating QR:', error);
      throw new Error('No se pudo crear el QR');
    }
  },

  async update(
    id: string,
    file: File,
    userId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('QR no encontrado');
      }

      const oldData = docSnap.data() as PaymentSettings;

      try {
        const oldStorageRef = ref(storage, oldData.qrImage.path);
        await deleteObject(oldStorageRef);
      } catch (deleteError) {
        console.log('Error deleting old QR:', deleteError);
      }

      const timestamp = Date.now();
      const storagePath = `payment/${oldData.planType}_${timestamp}.jpg`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const qrImage = {
        url: downloadURL,
        name: file.name,
        path: storagePath,
        size: file.size,
        type: file.type,
      };

      await updateDoc(docRef, {
        qrImage,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error updating QR:', error);
      throw new Error('No se pudo actualizar el QR');
    }
  },

  async softDelete(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, softDeleteModel(userId));
    } catch (error) {
      console.error('Error deleting QR:', error);
      throw new Error('No se pudo eliminar el QR');
    }
  },

  async toggleActive(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('QR no encontrado');
      }

      const currentData = docSnap.data() as PaymentSettings;
      const newActiveState = !currentData.isActive;

      if (newActiveState) {
        const existingQRs = query(
          collection(db, COLLECTION_NAME),
          where('planType', '==', currentData.planType),
          where('isDeleted', '==', false),
          where('isActive', '==', true)
        );
        const existingSnapshot = await getDocs(existingQRs);

        for (const doc of existingSnapshot.docs) {
          if (doc.id !== id) {
            await updateDoc(doc.ref, {
              isActive: false,
              ...updateModelTimestamp(userId),
            });
          }
        }
      }

      await updateDoc(docRef, {
        isActive: newActiveState,
        ...updateModelTimestamp(userId),
      });
    } catch (error) {
      console.error('Error toggling QR active state:', error);
      throw new Error('No se pudo cambiar el estado del QR');
    }
  },

  async getActiveQRs(): Promise<PaymentSettings[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('isDeleted', '==', false),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PaymentSettings[];
    } catch (error) {
      console.error('Error fetching active QRs:', error);
      throw new Error('No se pudieron cargar los QR activos');
    }
  },
};
