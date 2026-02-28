import { useState } from 'react';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ShipmentPricesTable } from '../components/shipment-prices-table';
import { ShipmentPriceForm } from '../components/shipment-price-form';
import { useShipmentPrices } from '../hooks/useShipmentPrices';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { ShipmentPrice } from '@/shared/types/shipment-price';
import { useModal } from '@/shared/hooks/useModal';

export function ShipmentPricesPage() {
    const { prices, isLoading, refetch, deletePrice } = useShipmentPrices();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [priceToEdit, setPriceToEdit] = useState<ShipmentPrice | null>(null);
    const modal = useModal();

    const handleOpenForm = () => {
        setPriceToEdit(null);
        setIsFormOpen(true);
    };

    const handleEdit = (price: ShipmentPrice) => {
        setPriceToEdit(price);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        modal.showConfirm(
            '¿Estás seguro de que deseas eliminar este precio de envío? Esta acción no se puede deshacer.',
            async () => {
                try {
                    await deletePrice(id);
                    modal.showSuccess('Precio de envío eliminado correctamente');
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Error al eliminar';
                    modal.showError(message);
                }
            },
            {
                title: 'Eliminar precio de envío',
                confirmText: 'Eliminar',
            }
        );
    };

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeaderGlobal
                    title="Precios de Envío"
                    description="Gestiona los precios de envío entre ciudades"
                />
                <Button onClick={handleOpenForm} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Agregar Precio
                </Button>
            </div>

            <ShipmentPricesTable
                prices={prices}
                isLoading={isLoading}
                onRefetch={refetch}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ShipmentPriceForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={refetch}
                initialData={priceToEdit}
            />
        </div>
    );
}
