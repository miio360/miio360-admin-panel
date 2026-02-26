import { useState, useCallback, useEffect } from 'react';
import { shipmentPriceService } from '@/shared/services/shipmentPriceService';
import { ShipmentPrice } from '@/shared/types/shipment-price';
import { useAuth } from '@/shared/hooks/useAuth';

export function useShipmentPrices() {
    const { user } = useAuth();
    const [prices, setPrices] = useState<ShipmentPrice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrices = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await shipmentPriceService.getAll();
            setPrices(data);
        } catch (err: any) {
            console.error('Error fetching shipment prices:', err);
            setError('Error al cargar los precios de envío');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const createPrice = async (priceData: Omit<ShipmentPrice, "id" | "createdAt" | "updatedAt" | "createdBy" | "isDeleted" | "deletedAt" | "deletedBy" | "updatedBy">) => {
        if (!user) throw new Error('Usuario no autenticado');
        try {
            const id = await shipmentPriceService.create(priceData, user.id);
            await fetchPrices();
            return id;
        } catch (err: any) {
            console.error('Error creating shipment price:', err);
            throw new Error('Error al crear el precio de envío');
        }
    };

    const updatePrice = async (id: string, priceData: Partial<Omit<ShipmentPrice, "id" | "createdAt" | "createdBy" | "isDeleted" | "deletedAt" | "deletedBy" | "updatedAt" | "updatedBy">>) => {
        if (!user) throw new Error('Usuario no autenticado');
        try {
            await shipmentPriceService.update(id, priceData, user.id);
            await fetchPrices();
        } catch (err: any) {
            console.error('Error updating shipment price:', err);
            throw new Error('Error al actualizar el precio de envío');
        }
    };

    const deletePrice = async (id: string) => {
        if (!user) throw new Error('Usuario no autenticado');
        try {
            await shipmentPriceService.delete(id, user.id);
            await fetchPrices();
        } catch (err: any) {
            console.error('Error deleting shipment price:', err);
            throw new Error('Error al eliminar el precio de envío');
        }
    };

    return {
        prices,
        isLoading,
        error,
        refetch: fetchPrices,
        createPrice,
        updatePrice,
        deletePrice,
    };
}
