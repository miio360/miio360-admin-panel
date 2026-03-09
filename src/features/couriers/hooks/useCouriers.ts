import { useEffect, useRef, useState } from 'react';
import { getCouriersPage } from '../api/courierService';
import { UserStatus } from '@/shared/types';
import type { User } from '@/shared/types';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export function useCouriers(page = 0, pageSize = 10, searchQuery = '') {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cursorsByPageRef = useRef<Map<number, QueryDocumentSnapshot<DocumentData> | null>>(
    new Map()
  );
  const requestIdRef = useRef(0);
  const lastSearchQueryRef = useRef(searchQuery);

  const ensureCursorForPage = async (
    targetPage: number
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> => {
    if (targetPage <= 0) return null;

    const existing = cursorsByPageRef.current.get(targetPage - 1);
    if (existing) return existing;

    cursorsByPageRef.current.clear();
    let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

    for (let i = 0; i < targetPage; i += 1) {
      const res = await getCouriersPage({ pageSize, cursor, searchQuery });
      cursor = res.lastDoc;
      cursorsByPageRef.current.set(i, cursor);
      if (!cursor) break;
    }

    return cursorsByPageRef.current.get(targetPage - 1) ?? null;
  };

  const fetchCouriers = () => {
    if (lastSearchQueryRef.current !== searchQuery) {
      cursorsByPageRef.current.clear();
      lastSearchQueryRef.current = searchQuery;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);

    void (async () => {
      try {
        const cursor = await ensureCursorForPage(page);
        const res = await getCouriersPage({ pageSize, cursor, searchQuery });
        cursorsByPageRef.current.set(page, res.lastDoc);

        if (requestIdRef.current !== requestId) return;

        setData(res.couriers);
        setTotal(res.total);
        setError(null);
      } catch (err: unknown) {
        if (requestIdRef.current !== requestId) return;
        setError(err instanceof Error ? err.message : 'Error al cargar repartidores');
      } finally {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    fetchCouriers();
  }, [page, pageSize, searchQuery]);

  const stats = {
    total,
    active: data.filter((u) => u.status === UserStatus.ACTIVE).length,
    available: data.filter((u) => u.courierProfile?.isAvailable === true).length,
  };

  return { data, total, isLoading, error, stats, refetch: fetchCouriers };
}
