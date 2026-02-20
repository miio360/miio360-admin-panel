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
import type { Order, OrderStatus } from '@/shared/types/order';

const PAGE_SIZE = 15;
const COLLECTION_NAME = 'orders';

interface UseOrdersTrackingReturn {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    statusFilter: OrderStatus | undefined;
    setStatusFilter: (status: OrderStatus | undefined) => void;
    nextPage: () => void;
    prevPage: () => void;
    refetch: () => void;
}

export function useOrdersTracking(): UseOrdersTrackingReturn {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [statusFilter, setStatusFilterState] = useState<OrderStatus | undefined>(undefined);

    const cursorStackRef = useRef<Array<QueryDocumentSnapshot | null>>([null]);
    const [stackSize, setStackSize] = useState(1);
    const currentPageCursorRef = useRef<QueryDocumentSnapshot | null>(null);
    const statusRef = useRef<OrderStatus | undefined>(undefined);
    const unsubRef = useRef<(() => void) | null>(null);

    const subscribePage = useCallback((
        startCursor: QueryDocumentSnapshot | null,
        filterStatus: OrderStatus | undefined,
    ) => {
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
            limit(PAGE_SIZE + 1),
        ];

        const q = query(collection(db, COLLECTION_NAME), ...constraints);

        unsubRef.current = onSnapshot(
            q,
            (snapshot) => {
                const hasMore = snapshot.docs.length > PAGE_SIZE;
                const visibleDocs = hasMore ? snapshot.docs.slice(0, PAGE_SIZE) : snapshot.docs;

                setOrders(
                    visibleDocs.map((d) => ({ id: d.id, ...d.data() })) as Order[]
                );
                setHasNextPage(hasMore);
                setIsLoading(false);

                if (visibleDocs.length > 0) {
                    currentPageCursorRef.current = visibleDocs[visibleDocs.length - 1];
                } else {
                    currentPageCursorRef.current = null;
                }
            },
            (err) => {
                console.error('Error subscribing to orders:', err);
                setError('No se pudieron cargar los pedidos');
                setIsLoading(false);
            },
        );
    }, []);

    // Initial subscription
    useEffect(() => {
        subscribePage(null, statusRef.current);
        return () => {
            if (unsubRef.current) unsubRef.current();
        };
    }, [subscribePage]);

    const setStatusFilter = useCallback((newStatus: OrderStatus | undefined) => {
        statusRef.current = newStatus;
        setStatusFilterState(newStatus);
        setPage(1);
        cursorStackRef.current = [null];
        setStackSize(1);
        subscribePage(null, newStatus);
    }, [subscribePage]);

    const nextPage = useCallback(() => {
        if (!hasNextPage || !currentPageCursorRef.current) return;
        const newCursor = currentPageCursorRef.current;
        cursorStackRef.current.push(newCursor);
        setStackSize(cursorStackRef.current.length);
        setPage((p) => p + 1);
        subscribePage(newCursor, statusRef.current);
    }, [hasNextPage, subscribePage]);

    const prevPage = useCallback(() => {
        if (cursorStackRef.current.length <= 1) return;
        cursorStackRef.current.pop();
        setStackSize(cursorStackRef.current.length);
        const prevCursor = cursorStackRef.current[cursorStackRef.current.length - 1];
        setPage((p) => Math.max(1, p - 1));
        subscribePage(prevCursor, statusRef.current);
    }, [subscribePage]);

    const refetch = useCallback(() => {
        const cursor = cursorStackRef.current[cursorStackRef.current.length - 1];
        subscribePage(cursor, statusRef.current);
    }, [subscribePage]);

    return {
        orders,
        isLoading,
        error,
        page,
        hasNextPage,
        hasPrevPage: stackSize > 1,
        statusFilter,
        setStatusFilter,
        nextPage,
        prevPage,
        refetch,
    };
}
