import { Timestamp } from 'firebase/firestore';

export interface ShipmentPrice {
    id: string;
    from: string; // city or zone
    to: string; // city or zone
    price: number; // under 1kg
    type: "local" | "national";
    excessPerKgPrice: number; // aditional price over 1kg
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isDeleted: boolean;
    deletedAt?: Timestamp | null;
    deletedBy?: string | null;
    createdBy: string;
    updatedBy?: string;
}