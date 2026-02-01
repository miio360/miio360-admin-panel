import { useState } from 'react';
import { usePaymentReceipts } from '../hooks/usePaymentReceipts';
import { paymentReceiptService } from '@/shared/services/paymentReceiptService';
import { useAuth } from '@/shared/hooks/useAuth';
import { PaymentReceipt, RejectionReason } from '@/shared/types/payment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import { Eye, Check, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { EmptyStateGlobal } from '@/shared/components/empty-state-global';
import { RejectDialog } from './reject-dialog';

export function PlansReceiptsTab() {
    const { user } = useAuth();
    const {
        receipts,
        isLoading,
        error,
        refetch,
        page,
        nextPage,
        prevPage,
        hasPrevPage,
        hasNextPage,
        setStatus
    } = usePaymentReceipts();

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleApprove = async (receipt: PaymentReceipt) => {
        if (!user?.id) return;
        try {
            setActionLoading(true);
            const sellerData = {
                id: receipt.seller.id,
                name: receipt.seller.name,
                profileImage: receipt.seller.avatar || '',
                storeName: receipt.seller.name,
            };
            await paymentReceiptService.approve(receipt.id, user.id, sellerData);
            await refetch();
        } catch (err) {
            console.error('Error al aprobar plan:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = (receipt: PaymentReceipt) => {
        setSelectedReceipt(receipt);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async (reason: RejectionReason, comment?: string) => {
        if (!user?.id || !selectedReceipt) return;
        try {
            setActionLoading(true);
            await paymentReceiptService.reject(selectedReceipt.id, user.id, reason, comment);
            await refetch();
            setRejectDialogOpen(false);
            setSelectedReceipt(null);
        } catch (err) {
            console.error('Error al rechazar:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading && page === 1 && receipts.length === 0) return <LoadingGlobal message="Cargando comprobantes de planes..." />;
    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <div className="space-y-4">
            {/* Filters can be added here, implementing setStatus */}
            <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setStatus(undefined)}>Todos</Button>
                    <Button variant="ghost" size="sm" onClick={() => setStatus('pending')}>Pendientes</Button>
                    <Button variant="ghost" size="sm" onClick={() => setStatus('approved')}>Aprobados</Button>
                    <Button variant="ghost" size="sm" onClick={() => setStatus('rejected')}>Rechazados</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prevPage} disabled={!hasPrevPage || isLoading}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium">Página {page}</span>
                    <Button variant="outline" size="sm" onClick={nextPage} disabled={!hasNextPage || isLoading}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {receipts.length === 0 ? (
                <EmptyStateGlobal
                    icon={<FileText className="w-12 h-12 text-gray-400" />}
                    message="No se encontraron comprobantes de planes"
                />
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Vendedor</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-center">Comprobante</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receipts.map((receipt) => (
                                <TableRow key={receipt.id}>
                                    <TableCell>
                                        {receipt.createdAt ? format(receipt.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: es }) : '-'}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{receipt.seller?.name || 'Vendedor'}</span>
                                            <span className="text-xs text-slate-500">{receipt.seller?.name || 'Sin tienda'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{receipt.plan?.title}</span>
                                            <Badge variant="outline" className="w-fit text-[10px] mt-1">{receipt.plan?.planType}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(receipt.plan?.price || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            receipt.status === 'approved' ? 'default' :
                                                receipt.status === 'pending' ? 'secondary' :
                                                    'destructive' // Shadcn destructive is usually error/red
                                        }>
                                            {receipt.status === 'approved' ? 'Aprobado' :
                                                receipt.status === 'pending' ? 'Pendiente' :
                                                    'Rechazado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {receipt.receiptImage?.url && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Ver
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                                                    <img
                                                        src={receipt.receiptImage.url}
                                                        alt="Comprobante"
                                                        className="w-full h-auto rounded-lg object-contain"
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {receipt.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-green-50 text-green-600"
                                                        title="Aprobar"
                                                        onClick={() => handleApprove(receipt)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-50 text-red-600"
                                                        title="Rechazar"
                                                        onClick={() => handleRejectClick(receipt)}
                                                        disabled={actionLoading}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <RejectDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                onConfirm={handleRejectConfirm}
                isLoading={actionLoading}
            />
        </div>
    );
}
