import { useState, useCallback, useEffect, useRef } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import type { OrderPaymentReceipt, OrderReceiptStatus } from '@/shared/types/recepit';

const PAGE_SIZE = 10;
const COLLECTION_NAME = 'order_receipts';

interface UseOrderReceiptsPaginatedReturn {
    receipts: OrderPaymentReceipt[];
    isLoading: boolean;
    error: string | null;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    status: OrderReceiptStatus | undefined;
    setStatus: (status: OrderReceiptStatus | undefined) => void;
    nextPage: () => void;
    prevPage: () => void;
    refetch: () => void;
}

export function useOrderReceiptsPaginated(): UseOrderReceiptsPaginatedReturn {
    const [receipts, setReceipts] = useState<OrderPaymentReceipt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [status, setStatusState] = useState<OrderReceiptStatus | undefined>(undefined);

    // Cursor stack: cursorStack[i] is the start cursor of page i+1
    // (null at index 0 means page 1 needs no cursor)
    const cursorStackRef = useRef<Array<QueryDocumentSnapshot | null>>([null]);
    const [stackSize, setStackSize] = useState(1); // reactive mirror for hasPrevPage
    const currentPageCursorRef = useRef<QueryDocumentSnapshot | null>(null);
    const statusRef = useRef<OrderReceiptStatus | undefined>(undefined);
    const unsubRef = useRef<(() => void) | null>(null);

    /** Subscribe to a Firestore query for the given cursor + status filter */
    const subscribePage = useCallback((
        startCursor: QueryDocumentSnapshot | null,
        filterStatus: OrderReceiptStatus | undefined,
    ) => {
        // Tear down previous listener
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
        }

        setIsLoading(true);
        setError(null);

        const constraints = [
            ...(filterStatus ? [where('status', '==', filterStatus)] : []),
            orderBy('createdAt', 'desc'),
            ...(startCursor ? [startAfter(startCursor)] : []),
            limit(PAGE_SIZE + 1), // +1 to detect next page
        ];

        const q = query(collection(db, COLLECTION_NAME), ...constraints);

        unsubRef.current = onSnapshot(
            q,
            (snapshot) => {
                const hasMore = snapshot.docs.length > PAGE_SIZE;
                const visibleDocs = hasMore ? snapshot.docs.slice(0, PAGE_SIZE) : snapshot.docs;

                setReceipts(
                    visibleDocs.map((d) => ({ id: d.id, ...d.data() })) as OrderPaymentReceipt[]
                );
                setHasNextPage(hasMore);
                setIsLoading(false);

                // Store last visible doc as the end-cursor for this page
                if (visibleDocs.length > 0) {
                    currentPageCursorRef.current = visibleDocs[visibleDocs.length - 1];
                } else {
                    currentPageCursorRef.current = null;
                }
            },
            (err) => {
                setError(err.message || 'Error al cargar los comprobantes');
                setIsLoading(false);
            }
        );
    }, []);

    // Mount: subscribe to page 1
    useEffect(() => {
        subscribePage(null, statusRef.current);
        return () => { unsubRef.current?.(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const setStatus = useCallback((newStatus: OrderReceiptStatus | undefined) => {
        statusRef.current = newStatus;
        setStatusState(newStatus);
        // Reset to page 1
        cursorStackRef.current = [null];
        setStackSize(1);
        setPage(1);
        subscribePage(null, newStatus);
    }, [subscribePage]);

    const refetch = useCallback(() => {
        // Re-subscribe to current page (listener already updates live,
        // but call this after an action to ensure fresh state)
        const cursor = cursorStackRef.current[cursorStackRef.current.length - 2] ?? null;
        subscribePage(cursor, statusRef.current);
    }, [subscribePage]);

    const nextPage = useCallback(() => {
        if (!hasNextPage || isLoading || !currentPageCursorRef.current) return;
        const nextCursor = currentPageCursorRef.current;
        cursorStackRef.current = [...cursorStackRef.current, nextCursor];
        setStackSize(cursorStackRef.current.length);
        setPage((p) => p + 1);
        subscribePage(nextCursor, statusRef.current);
    }, [hasNextPage, isLoading, subscribePage]);

    const prevPage = useCallback(() => {
        if (cursorStackRef.current.length <= 1) return;
        const newStack = cursorStackRef.current.slice(0, -1);
        cursorStackRef.current = newStack;
        setStackSize(newStack.length);
        setPage((p) => p - 1);
        const prevCursor = newStack[newStack.length - 2] ?? null;
        subscribePage(prevCursor, statusRef.current);
    }, [subscribePage]);

    return {
        receipts,
        isLoading,
        error,
        page,
        hasNextPage,
        hasPrevPage: stackSize > 1,
        status,
        setStatus,
        nextPage,
        prevPage,
        refetch,
    };
}
