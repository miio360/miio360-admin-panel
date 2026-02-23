import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useShipmentPrices } from '../hooks/useShipmentPrices';
import { toast } from 'sonner';
import { ShipmentPrice } from '@/shared/types/shipment-price';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

interface FormValues {
    from: string;
    to: string;
    type: 'local' | 'national';
    price: number;
    excessPerKgPrice: number;
}

export function ShipmentPriceForm({ isOpen, onClose, onSuccess, initialData }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, initialData?: ShipmentPrice | null }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markerFrom = useRef<mapboxgl.Marker | null>(null);
    const markerTo = useRef<mapboxgl.Marker | null>(null);

    const { createPrice, updatePrice } = useShipmentPrices();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectingTarget, setSelectingTarget] = useState<'from' | 'to'>('from');

    const { register, handleSubmit, control, setValue, watch, reset } = useForm<FormValues>({
        defaultValues: {
            from: '',
            to: '',
            type: 'local',
            price: 20,
            excessPerKgPrice: 10,
        }
    });

    const typeValue = watch('type');

    useEffect(() => {
        if (initialData) {
            reset({
                from: initialData.from,
                to: initialData.to,
                type: initialData.type as 'local' | 'national',
                price: initialData.price,
                excessPerKgPrice: initialData.excessPerKgPrice ?? 10,
            });
        } else {
            reset({
                from: '',
                to: '',
                type: 'local',
                price: 20,
                excessPerKgPrice: 10,
            });
        }
    }, [initialData, reset, isOpen]);

    // Change default price when type changes
    useEffect(() => {
        if (initialData) return;
        if (typeValue === 'local') {
            setValue('price', 20);
        } else {
            setValue('price', 30);
        }
    }, [typeValue, setValue, initialData]);

    const targetRef = useRef(selectingTarget);
    useEffect(() => {
        targetRef.current = selectingTarget;
    }, [selectingTarget]);

    // Init Map
    useEffect(() => {
        if (!isOpen) return;

        // Delay to let the Dialog portal/animation fully mount the container in the DOM
        const initTimer = setTimeout(() => {
            if (!mapContainer.current || map.current) return;

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [-63.1812, -17.7833],
                zoom: 5
            });

            map.current.on('click', async (e) => {
                const { lng, lat } = e.lngLat;
                const currentTarget = targetRef.current;

                try {
                    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`);
                    const data = await res.json();

                    let city = 'Ubicación Desconocida';
                    if (data.features && data.features.length > 0) {
                        const feature = data.features[0];
                        const context = feature.properties.context;
                        city = context?.place?.name || context?.locality?.name || feature.properties.name_preferred || city;
                    }

                    if (currentTarget === 'from') {
                        if (markerFrom.current) markerFrom.current.remove();
                        markerFrom.current = new mapboxgl.Marker({ color: '#10b981' })
                            .setLngLat([lng, lat])
                            .addTo(map.current!);
                        setValue('from', city);
                    } else {
                        if (markerTo.current) markerTo.current.remove();
                        markerTo.current = new mapboxgl.Marker({ color: '#6366f1' })
                            .setLngLat([lng, lat])
                            .addTo(map.current!);
                        setValue('to', city);
                    }
                } catch (err) {
                    console.error("Geocoding err", err);
                    toast.error("Error al obtener la ciudad");
                }
            });

            // Resize at intervals to ensure map draws after dialog animation
            [300, 600].forEach(time => setTimeout(() => map.current?.resize(), time));

            // ResizeObserver as fallback
            const observer = new ResizeObserver(() => map.current?.resize());
            observer.observe(mapContainer.current!);
        }, 150);

        return () => {
            clearTimeout(initTimer);
        };

    }, [isOpen, setValue]);

    // Cleanup on close
    useEffect(() => {
        if (!isOpen) {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
            if (markerFrom.current) markerFrom.current = null;
            if (markerTo.current) markerTo.current = null;
            reset();
            setSelectingTarget('from');
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: FormValues) => {
        if (!data.from || !data.to) {
            toast.error("Falta origen o destino");
            return;
        }
        try {
            setIsSubmitting(true);
            if (initialData?.id) {
                await updatePrice(initialData.id, data);
                toast.success("Precio actualizado correctamente");
            } else {
                await createPrice(data);
                toast.success("Precio creado correctamente");
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Error al guardar");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Precio de Envío' : 'Registrar Precio de Envío'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-slate-700">Seleccionando actual:</span>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={selectingTarget === 'from' ? 'default' : 'outline'}
                                className={selectingTarget === 'from' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                                onClick={() => setSelectingTarget('from')}
                            >
                                Fijar Origen
                            </Button>
                            <Button
                                type="button"
                                variant={selectingTarget === 'to' ? 'default' : 'outline'}
                                className={selectingTarget === 'to' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                                onClick={() => setSelectingTarget('to')}
                            >
                                Fijar Destino
                            </Button>
                        </div>
                    </div>

                    <div
                        ref={mapContainer}
                        className="w-full h-[320px] rounded-xl overflow-hidden border border-slate-200"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Ciudad Origen</Label>
                            <Input {...register('from')} readOnly placeholder="Haz clic en el mapa" className="bg-slate-50 border-emerald-200 cursor-not-allowed" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Ciudad Destino</Label>
                            <Input {...register('to')} readOnly placeholder="Haz clic en el mapa" className="bg-slate-50 border-indigo-200 cursor-not-allowed" />
                        </div>
                        <div className="space-y-1.5 ">
                            <Label>Tipo de Envío</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="local">Local</SelectItem>
                                            <SelectItem value="national">Nacional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Precio Sugerido (Bs.)</Label>
                            <Input type="number" step="0.5" {...register('price', { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                            <Label>Precio Kg Extra (Bs.)</Label>
                            <Input type="number" step="0.5" {...register('excessPerKgPrice', { valueAsNumber: true })} />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Guardar Precio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
