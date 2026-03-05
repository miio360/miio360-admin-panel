import { httpsCallable } from 'firebase/functions';
import { functions } from '@/shared/services/firebase';

interface CloudFunctionResponse {
    success: boolean;
    message?: string;
    orderId?: string;
    orderNumber?: string;
    status?: string;
    code?: string;
}

export const ordersTrackingService = {
    /**
     * Calls the cancelOrder cloud function to cancel an order.
     */
    async cancelOrder(orderId: string, reason?: string): Promise<CloudFunctionResponse> {
        try {
            const cancelOrderFn = httpsCallable(functions, 'cancelOrder');
            const result = await cancelOrderFn({ orderId, reason });
            const data = result.data as CloudFunctionResponse;
            if (!data.success) {
                throw new Error(data.message || 'Error al cancelar el pedido');
            }
            return data;
        } catch (error) {
            console.error('Error cancelling order:', error);
            if (error instanceof Error) throw error;
            throw new Error('No se pudo cancelar el pedido');
        }
    },

    /**
     * Marks the payment for a specific recipient as completed.
     * @param recipient - 'seller' | 'courier' | 'client'
     */
    async markPaymentUserCompleted(orderId: string, recipient: 'seller' | 'courier' | 'client'): Promise<CloudFunctionResponse> {
        try {
            const markPaymentFn = httpsCallable(functions, 'markPaymentUserCompleted');
            const result = await markPaymentFn({ orderId, recipient });
            const data = result.data as CloudFunctionResponse;
            if (!data.success) {
                throw new Error(data.message || 'Error al marcar pago como completado');
            }
            return data;
        } catch (error) {
            console.error('Error marking payment user completed:', error);
            if (error instanceof Error) throw error;
            throw new Error('No se pudo marcar el pago como completado');
        }
    },
    /**
     * Assigns a courier to an order manually (admin only).
     * Calls the assignCourierToOrder cloud function.
     */
    async assignCourier(orderId: string, courierId: string): Promise<CloudFunctionResponse> {
        try {
            const assignFn = httpsCallable(functions, 'assignCourierToOrder');
            const result = await assignFn({ orderId, courierId });
            const data = result.data as CloudFunctionResponse;
            if (!data.success) {
                throw new Error(data.message || 'Error al asignar el repartidor');
            }
            return data;
        } catch (error) {
            console.error('Error assigning courier:', error);
            if (error instanceof Error) throw error;
            throw new Error('No se pudo asignar el repartidor');
        }
    },
};
