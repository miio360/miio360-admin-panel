import { useState } from 'react';
import { useWalletTransactions } from '../hooks/useWalletTransactions';
import { walletTransactionService } from '@/shared/services/wallet-transaction-service';
import { useAuth } from '@/shared/hooks/useAuth';
import { WalletTransaction } from '@/shared/types/wallet';
import { RejectionReason, REJECTION_REASON_LABELS } from '@/shared/types/payment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Eye, Check, X, CreditCard as CardIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LoadingGlobal } from '@/shared/components/loading-global';
import { ErrorGlobal } from '@/shared/components/error-global';
import { EmptyStateGlobal } from '@/shared/components/empty-state-global';
import { RejectDialog } from './reject-dialog';

export function TransactionsReceiptsTab() {
    const { user } = useAuth();
    const { transactions, isLoading, error, refetch } = useWalletTransactions();

    const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const handleApproveClick = (tx: WalletTransaction) => {
        setSelectedTransaction(tx);
        setApproveDialogOpen(true);
    };

    const handleConfirmApprove = async () => {
        if (!user?.id || !selectedTransaction) return;
        try {
            setActionLoading(true);
            await walletTransactionService.approve(selectedTransaction.seller.id, selectedTransaction.id, user.id);
            await refetch();
            setApproveDialogOpen(false);
            setSelectedTransaction(null);
        } catch (err) {
            console.error('Error al aprobar transacción:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = (tx: WalletTransaction) => {
        setSelectedTransaction(tx);
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = async (reason: RejectionReason, comment?: string) => {
        if (!user?.id || !selectedTransaction) return;
        try {
            setActionLoading(true);
            const reasonText = reason === 'other' ? (comment || 'Sin motivo especificado') : REJECTION_REASON_LABELS[reason];
            await walletTransactionService.reject(selectedTransaction.seller.id, selectedTransaction.id, user.id, reasonText);
            await refetch();
            setRejectDialogOpen(false);
            setSelectedTransaction(null);
        } catch (err) {
            console.error('Error al rechazar transacción:', err);
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) return <LoadingGlobal message="Cargando transacciones..." />;
    if (error) return <ErrorGlobal message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {transactions.length === 0 ? (
                <EmptyStateGlobal
                    icon={<CardIcon className="w-12 h-12 text-gray-400" />}
                    message="No se encontraron transacciones"
                />
            ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Comprador</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        {tx.createdAt ? format(tx.createdAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: es }) : '-'}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{tx.seller?.name || 'Desconocido'}</span>
                                            <span className="text-xs text-slate-500">{tx.seller?.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{tx.plan?.title || tx.description}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(tx.price || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            tx.status === 'completed' ? 'default' :
                                                tx.status === 'pending' ? 'secondary' :
                                                    'outline'
                                        }>
                                            {tx.status === 'completed' ? 'Aprobado' :
                                                tx.status === 'pending' ? 'Pendiente' :
                                                    tx.status === 'failed' ? 'Rechazado' : tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {tx.receipt?.url && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Ver comprobante">
                                                            <Eye className="w-4 h-4 text-slate-500" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        <img src={tx.receipt.url} alt="Comprobante" className="w-full h-auto rounded-lg" />
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            {tx.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-green-50"
                                                        title="Aprobar"
                                                        onClick={() => handleApproveClick(tx)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Check className="w-4 h-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-50"
                                                        title="Rechazar"
                                                        onClick={() => handleRejectClick(tx)}
                                                        disabled={actionLoading}
                                                    >
                                                        <X className="w-4 h-4 text-red-600" />
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

            {/* Approve Dialog */}
            <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Aprobación</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas aprobar esta transacción? Se acreditará el saldo al usuario de inmediato.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedTransaction && (
                            <div className="bg-slate-50 p-4 rounded-md text-sm border border-slate-200">
                                <p><strong>Comprador:</strong> {selectedTransaction.seller?.name}</p>
                                <p><strong>Monto:</strong> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(selectedTransaction.price || 0)}</p>
                                <p><strong>Plan:</strong> {selectedTransaction.plan?.title || selectedTransaction.description}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setApproveDialogOpen(false)} disabled={actionLoading}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirmApprove} disabled={actionLoading}>
                            {actionLoading ? 'Aprobando...' : 'Aprobar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RejectDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                onConfirm={handleConfirmReject}
                isLoading={actionLoading}
            />
        </div>
    );
}
