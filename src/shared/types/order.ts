import { SellerSummary } from './summaries';

// ─── Enums ─────────────────────────────────────────────────────────────────────

export enum OrderStatus {
  RESERVED = 'reserved',
  PENDING_PAY_CONFIRMATION = 'pending_pay_confirmation',
  PAID = 'paid',
  PREPARING = 'preparing',
  PENDING_PICKUP = 'pending_pickup',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  CANCELLED_BY_SELLER = 'cancelled_by_seller',
  PENDING_REFUND = 'pending_refund',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

export enum PaymentMethod {
  VPAY = 'vpay',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CARD = 'card',
  QR = 'qr',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sellerId: string;
  sellerName: string;
}

export interface ShippingAddress {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    country?: string;
  };
  additionalInfo?: string;
}

export interface OrderTracking {
  status: OrderStatus;
  timestamp: { seconds: number; nanoseconds: number };
  location?: string;
  notes?: string;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  provider: 'vpay' | 'cash' | 'card';
  transactionId?: string;
  qrImageUrl?: string;
  receiptId?: string;
  confirmedBy?: string;
  initiatedAt?: { seconds: number; nanoseconds: number };
  completedAt?: { seconds: number; nanoseconds: number };
}

export interface PaymentUserStatus {
  toUser: 'client' | 'seller';
  status: PaymentStatus;
  amount?: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userPhone: string;

  sellerId: string;
  sellerName: string;
  seller: SellerSummary;

  items: OrderItem[];

  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;

  payment: OrderPayment;
  paymentUserStatus?: PaymentUserStatus;

  shippingAddress: ShippingAddress;

  courierId?: string;
  courierName?: string;
  estimatedDelivery?: { seconds: number; nanoseconds: number };

  status: OrderStatus;
  tracking: OrderTracking[];

  stockReservationExpiry?: { seconds: number; nanoseconds: number };

  sellerRating?: number;
  courierRating?: number;
  reviewText?: string;

  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  deliveredAt?: { seconds: number; nanoseconds: number };
  cancelledAt?: { seconds: number; nanoseconds: number };
  notes?: string;
  cancelReason?: string;
}

// ─── Labels / Config ───────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.RESERVED]: 'Reservado',
  [OrderStatus.PENDING_PAY_CONFIRMATION]: 'Pendiente de pago',
  [OrderStatus.PAID]: 'Pagado',
  [OrderStatus.PREPARING]: 'Preparando',
  [OrderStatus.PENDING_PICKUP]: 'Esperando courier',
  [OrderStatus.PICKED_UP]: 'Recolectado',
  [OrderStatus.IN_TRANSIT]: 'En camino',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.CANCELLED_BY_SELLER]: 'Cancelado por vendedor',
  [OrderStatus.PENDING_REFUND]: 'Pendiente reembolso',
  [OrderStatus.REFUNDED]: 'Reembolsado',
  [OrderStatus.COMPLETED]: 'Completado',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.VPAY]: 'VPay',
  [PaymentMethod.CASH_ON_DELIVERY]: 'Contra entrega',
  [PaymentMethod.CARD]: 'Tarjeta',
  [PaymentMethod.QR]: 'QR',
};

export const PAYMENT_USER_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.COMPLETED]: 'Completado',
  [PaymentStatus.FAILED]: 'Fallido',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
};
