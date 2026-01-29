import { useEffect, useRef, useState } from 'react';
import { userService } from '@/shared/services/userService';
import { UserStatus } from '@/shared/types';
import type { User } from '@/shared/types';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export function useUsers(page = 0, pageSize = 6) {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cursorsByPageRef = useRef<Map<number, QueryDocumentSnapshot<DocumentData> | null>>(new Map());
  const prevPageSizeRef = useRef<number>(pageSize);
  const requestIdRef = useRef(0);

  const ensureCursorForPage = async (targetPage: number): Promise<QueryDocumentSnapshot<DocumentData> | null> => {
    if (targetPage <= 0) return null;

    const existing = cursorsByPageRef.current.get(targetPage - 1);
    if (existing) return existing;

    // Si el usuario salta a una página sin cursor conocido, reconstruimos el chain desde 0.
    cursorsByPageRef.current.clear();
    let cursor: QueryDocumentSnapshot<DocumentData> | null = null;

    for (let pageIndex = 0; pageIndex < targetPage; pageIndex += 1) {
      const res = await userService.getPage({ pageSize, cursor });
      cursor = res.lastDoc;
      cursorsByPageRef.current.set(pageIndex, cursor);
      if (!cursor) break;
    }

    return cursorsByPageRef.current.get(targetPage - 1) ?? null;
  };

  const fetchUsers = () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);

    void (async () => {
      try {
        if (prevPageSizeRef.current !== pageSize) {
          prevPageSizeRef.current = pageSize;
          cursorsByPageRef.current.clear();
        }

        const cursor = await ensureCursorForPage(page);
        const res = await userService.getPage({ pageSize, cursor });
        cursorsByPageRef.current.set(page, res.lastDoc);

        if (requestIdRef.current !== requestId) return;

        setData(res.users);
        setTotal(res.total);
        setError(null);
      } catch (err: unknown) {
        if (requestIdRef.current !== requestId) return;
        const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
        setError(message);
      } finally {
        if (requestIdRef.current !== requestId) return;
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  // Stats
  const stats = {
    total,
    active: data.filter(u => u.status === UserStatus.ACTIVE).length,
    customers: data.filter(u => u.activeRole === 'customer').length,
    sellers: data.filter(u => u.activeRole === 'seller').length,
    couriers: data.filter(u => u.activeRole === 'courier').length,
    admins: data.filter(u => u.activeRole === 'admin').length,
  };

  return { data, total, isLoading, error, stats, refetch: fetchUsers };
}
