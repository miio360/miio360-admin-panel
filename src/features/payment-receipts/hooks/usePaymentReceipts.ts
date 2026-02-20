import { useState, useEffect, useCallback } from 'react';
import { paymentReceiptService } from '@/shared/services/paymentReceiptService';
import type { PaymentReceipt, PaymentReceiptStatus } from '@/shared/types/payment';

interface UsePaymentReceiptsReturn {
  receipts: PaymentReceipt[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Pagination
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  // Filters
  setStatus: (status: PaymentReceiptStatus | undefined) => void;
}

const PAGE_SIZE = 10;

export function usePaymentReceipts(initialStatus?: PaymentReceiptStatus): UsePaymentReceiptsReturn {
  const [status, setStatus] = useState<PaymentReceiptStatus | undefined>(initialStatus);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<any[]>([]); // Array to store the last document of each page
  const [hasMore, setHasMore] = useState(true);

  const fetchReceipts = useCallback(async (targetPage: number, currentCursors: any[], currentStatus?: PaymentReceiptStatus) => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine the cursor to start after
      // Page 1: startAfter undefined
      // Page 2: startAfter cursors[0]
      const startAfterDoc = targetPage > 1 ? currentCursors[targetPage - 2] : undefined;

      const { receipts: newReceipts, lastDoc } = await paymentReceiptService.getPaginated(
        PAGE_SIZE,
        startAfterDoc,
        currentStatus || 'all'
      );

      setReceipts(newReceipts);
      setHasMore(newReceipts.length === PAGE_SIZE); // Heuristic

      // Update cursors if we just loaded a page we haven't mapped yet
      if (lastDoc && targetPage > currentCursors.length) {
        // Create a new array to avoid mutation issues, though we are setting state
        // Actually, we should only update cursors if we moved *forward* to a new page
      }
      return lastDoc;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and filter change
  useEffect(() => {
    // Reset pagination when status changes
    setPage(1);
    setCursors([]);
    setHasMore(true);

    // Fetch page 1
    (async () => {
      setIsLoading(true);
      try {
        const { receipts: newReceipts, lastDoc } = await paymentReceiptService.getPaginated(PAGE_SIZE, undefined, status || 'all');
        setReceipts(newReceipts);
        setHasMore(newReceipts.length === PAGE_SIZE);
        if (lastDoc) {
          setCursors([lastDoc]);
        } else {
          setCursors([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [status]);

  const nextPage = async () => {
    if (!hasMore) return;

    // We already have the cursor for the current page end in `cursors[page-1]`?
    // Wait, initial load sets cursors[0] = end of page 1.
    // So to load page 2, we need cursors[0].

    const nextPageNum = page + 1;
    // We rely on the cursor stored from previous fetch
    const cursor = cursors[page - 1];
    if (!cursor) return; // Should not happen if hasMore is true and logic is correct

    setIsLoading(true);
    try {
      const { receipts: newReceipts, lastDoc } = await paymentReceiptService.getPaginated(PAGE_SIZE, cursor, status || 'all');
      setReceipts(newReceipts);
      setPage(nextPageNum);
      setHasMore(newReceipts.length === PAGE_SIZE);

      // Store the new cursor
      // If we represent cursors as: index 0 -> last doc of Page 1.
      // We are now on Page 2. lastDoc is end of Page 2. Store at index 1.
      if (lastDoc) {
        setCursors(prev => {
          const newCursors = [...prev];
          newCursors[nextPageNum - 1] = lastDoc;
          return newCursors;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const prevPage = async () => {
    if (page <= 1) return;
    const prevPageNum = page - 1;

    // To load PrevPage (e.g. going to 1 from 2), we need cursor for start of 1.
    // Start of 1 is undefined.
    // Start of 2 is cursors[0].
    // So to load Page P, we need cursors[P-2].

    const cursor = prevPageNum > 1 ? cursors[prevPageNum - 2] : undefined;

    setIsLoading(true);
    try {
      const { receipts: newReceipts, lastDoc } = await paymentReceiptService.getPaginated(PAGE_SIZE, cursor, status || 'all');
      setReceipts(newReceipts);
      setPage(prevPageNum);
      setHasMore(true); // If we went back, we definitely have more forward (usually)

      // We don't strictly need to update cursors since they should be stable for past pages,
      // but if data changed, it might be safer not to invalidate future cursors unless necessary.
      // For simple pagination, we keep them.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    // Reload current page
    const cursor = page > 1 ? cursors[page - 2] : undefined;
    try {
      setIsLoading(true);
      const { receipts: newReceipts, lastDoc } = await paymentReceiptService.getPaginated(PAGE_SIZE, cursor, status || 'all');
      setReceipts(newReceipts);
      // data might have changed, so we might need to update cursor for THIS page end
      if (lastDoc) {
        setCursors(prev => {
          const newCursors = [...prev];
          newCursors[page - 1] = lastDoc;
          return newCursors;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    receipts,
    isLoading,
    error,
    refetch,
    page,
    nextPage,
    prevPage,
    hasPrevPage: page > 1,
    hasNextPage: hasMore,
    setStatus
  };
}
