import { useState } from 'react';
import { PageHeaderGlobal } from '@/shared/components/page-header-global';
import { ShipmentPricesTable } from '../components/shipment-prices-table';
import { ShipmentPriceForm } from '../components/shipment-price-form';
import { useShipmentPrices } from '../hooks/useShipmentPrices';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';
import { ShipmentPrice } from '@/shared/types/shipment-price';

export function ShipmentPricesPage() {
    const { prices, isLoading, refetch } = useShipmentPrices();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [priceToEdit, setPriceToEdit] = useState<ShipmentPrice | null>(null);

    const handleOpenForm = () => {
        setPriceToEdit(null);
        setIsFormOpen(true);
    };

    const handleEdit = (price: ShipmentPrice) => {
        setPriceToEdit(price);
        setIsFormOpen(true);
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
