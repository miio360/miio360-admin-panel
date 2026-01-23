import { useState, useEffect, useCallback, useRef } from 'react';
import { planService } from '../services/planService';
import type { Plan, PlanType } from '../types/plan';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface UsePlansReturn {
  plans: Plan[];
  isInitialLoading: boolean;
  isPaginationLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  goToPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function usePlans(planType: PlanType): UsePlansReturn {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageDocsCache = useRef<Map<number, QueryDocumentSnapshot<DocumentData>>>(new Map());

  const fetchPage = useCallback(async (page: number, isInitial = false) => {
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsPaginationLoading(true);
      }
      setError(null);
      
      const lastDoc = page > 1 ? pageDocsCache.current.get(page - 1) : null;
      
      const result = await planService.getByTypePaginated(planType, page, lastDoc);
      
      setPlans(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      
      if (result.lastDoc) {
        pageDocsCache.current.set(page, result.lastDoc);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsPaginationLoading(false);
      }
    }
  }, [planType]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    if (page < currentPage) {
      pageDocsCache.current.clear();
      setCurrentPage(1);

      const loadPagesSequentially = async () => {
        setIsPaginationLoading(true);
        try {
          let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
          for (let p = 1; p <= page; p++) {
            const result = await planService.getByTypePaginated(planType, p, lastDoc);
            if (p === page) {
              setPlans(result.data);
              setTotalPages(result.totalPages);
              setTotalCount(result.totalCount);
            }
            if (result.lastDoc) {
              pageDocsCache.current.set(p, result.lastDoc);
              lastDoc = result.lastDoc;
            }
          }
          setCurrentPage(page);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Error desconocido';
          setError(message);
        } finally {
          setIsPaginationLoading(false);
        }
      };
      loadPagesSequentially();
    } else {
      setCurrentPage(page);
      fetchPage(page);
    }
  }, [currentPage, totalPages, planType, fetchPage]);

  const refetch = useCallback(async () => {
    pageDocsCache.current.clear();
    setCurrentPage(1);
    await fetchPage(1, false);
  }, [fetchPage]);

  useEffect(() => {
    pageDocsCache.current.clear();
    setCurrentPage(1);
    fetchPage(1, true);
  }, [planType, fetchPage]);

  return {
    plans,
    isInitialLoading,
    isPaginationLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    refetch,
  };
}
