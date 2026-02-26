import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { ShipmentPrice } from "../types/shipment-price";
import { createBaseModel, updateModelTimestamp, softDeleteModel } from "../types/base";

const COLLECTION_NAME = "shipment-prices";

export const shipmentPriceService = {
    // Get all active shipment prices
    async getAll(): Promise<ShipmentPrice[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("isDeleted", "==", false),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt as Timestamp,
                updatedAt: data.updatedAt as Timestamp,
            } as ShipmentPrice;
        });
    },

    // Get shipment price by ID
    async getById(id: string): Promise<ShipmentPrice | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.isDeleted) return null;
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt as Timestamp,
                updatedAt: data.updatedAt as Timestamp,
            } as ShipmentPrice;
        }
        return null;
    },

    // Create shipment price
    async create(priceData: Omit<ShipmentPrice, "id" | "createdAt" | "updatedAt" | "createdBy" | "isDeleted" | "deletedAt" | "deletedBy" | "updatedBy">, userId: string): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...priceData,
            ...createBaseModel(userId),
        });
        return docRef.id;
    },

    // Update shipment price
    async update(id: string, priceData: Partial<Omit<ShipmentPrice, "id" | "createdAt" | "createdBy" | "isDeleted" | "deletedAt" | "deletedBy" | "updatedAt" | "updatedBy">>, userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const updateData: any = { ...priceData, ...updateModelTimestamp(userId) };
        await updateDoc(docRef, updateData);
    },

    // Soft Delete shipment price
    async delete(id: string, userId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, softDeleteModel(userId));
    },

    // Hard Delete shipment price (optional, if needed)
    async destroy(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    },
};
