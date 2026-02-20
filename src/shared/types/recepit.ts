import { ClientSummary, SellerSummary } from ".";

export type OrderReceiptStatus = 'pending' | 'approved' | 'rejected';

export interface OrderPaymentReceipt {
    id: string;
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    client: ClientSummary; // Comprador
    seller: SellerSummary
    receiptImageUrl: string;
    status: OrderReceiptStatus;
    createdAt: number;
}