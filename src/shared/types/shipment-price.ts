import { Timestamp } from 'firebase/firestore';

export interface ShipmentPrice {
    id: string;
    from: string; // city or zone
    to: string; // city or zone
    price: number;
    type: "local" | "national";
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isDeleted: boolean;
    deletedAt?: Timestamp | null;
    deletedBy?: string | null;
    createdBy: string;
    updatedBy?: string;
}