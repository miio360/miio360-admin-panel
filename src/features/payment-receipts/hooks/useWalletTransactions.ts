
import { useState, useEffect, useCallback } from 'react';
import { walletTransactionService } from '@/shared/services/wallet-transaction-service';
import { WalletTransaction } from '@/shared/types/wallet';

export function useWalletTransactions() {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await walletTransactionService.getAllPurchases();
            setTransactions(data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError('Error al cargar transacciones');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        error,
        refetch: fetchTransactions,
    };
}
