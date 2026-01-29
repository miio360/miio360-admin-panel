import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import type { DashboardStats, TopSeller } from '../types/dashboard';
import { UserRole, UserStatus } from '@/shared/types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const usersRef = collection(db, 'users');
      const categoriesRef = collection(db, 'categories');
      const subcategoriesRef = collection(db, 'subcategories');
      const receiptsRef = collection(db, 'payment_receipts');
      const activePlansRef = collection(db, 'active_plans');

      const [
        totalUsersSnap,
        sellersSnap,
        couriersSnap,
        customersSnap,
        activeUsersSnap,
        pendingVerificationSnap,
        suspendedUsersSnap,
        totalCategoriesSnap,
        activeCategoriesSnap,
        inactiveCategoriesSnap,
        totalSubcategoriesSnap,
        activeSubcategoriesSnap,
        totalReceiptsSnap,
        pendingReceiptsSnap,
        approvedReceiptsSnap,
        rejectedReceiptsSnap,
        totalActivePlansSnap,
        pendingAssignmentPlansSnap,
        scheduledPlansSnap,
        activePlansSnap,
        expiredPlansSnap,
      ] = await Promise.all([
        getCountFromServer(query(usersRef)),
        getCountFromServer(query(usersRef, where('activeRole', '==', UserRole.SELLER))),
        getCountFromServer(query(usersRef, where('activeRole', '==', UserRole.COURIER))),
        getCountFromServer(query(usersRef, where('activeRole', '==', UserRole.CUSTOMER))),
        getCountFromServer(query(usersRef, where('status', '==', UserStatus.ACTIVE))),
        getCountFromServer(query(usersRef, where('status', '==', UserStatus.PENDING_VERIFICATION))),
        getCountFromServer(query(usersRef, where('status', '==', UserStatus.SUSPENDED))),
        getCountFromServer(query(categoriesRef)),
        getCountFromServer(query(categoriesRef, where('isActive', '==', true))),
        getCountFromServer(query(categoriesRef, where('isActive', '==', false))),
        getCountFromServer(query(subcategoriesRef)),
        getCountFromServer(query(subcategoriesRef, where('isActive', '==', true))),
        getCountFromServer(query(receiptsRef)),
        getCountFromServer(query(receiptsRef, where('status', '==', 'pending'))),
        getCountFromServer(query(receiptsRef, where('status', '==', 'approved'))),
        getCountFromServer(query(receiptsRef, where('status', '==', 'rejected'))),
        getCountFromServer(query(activePlansRef)),
        getCountFromServer(query(activePlansRef, where('status', '==', 'pending_assignment'))),
        getCountFromServer(query(activePlansRef, where('status', '==', 'scheduled'))),
        getCountFromServer(query(activePlansRef, where('status', '==', 'active'))),
        getCountFromServer(query(activePlansRef, where('status', '==', 'expired'))),
      ]);

      const approvedReceipts = await getDocs(
        query(receiptsRef, where('status', '==', 'approved'))
      );
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      let revenueCurrentMonth = 0;
      let revenueLastMonth = 0;

      approvedReceipts.docs.forEach((doc) => {
        const data = doc.data();
        const approvedAt = data.approvedAt?.toDate();
        const price = data.plan?.price || 0;
        
        if (approvedAt) {
          const month = approvedAt.getMonth();
          const year = approvedAt.getFullYear();
          
          if (year === currentYear && month === currentMonth) {
            revenueCurrentMonth += price;
          } else if (
            (year === currentYear && month === currentMonth - 1) ||
            (year === currentYear - 1 && currentMonth === 0 && month === 11)
          ) {
            revenueLastMonth += price;
          }
        }
      });

      return {
        totalUsers: totalUsersSnap.data().count,
        totalSellers: sellersSnap.data().count,
        totalCouriers: couriersSnap.data().count,
        totalCustomers: customersSnap.data().count,
        activeUsers: activeUsersSnap.data().count,
        pendingVerification: pendingVerificationSnap.data().count,
        suspendedUsers: suspendedUsersSnap.data().count,
        
        totalCategories: totalCategoriesSnap.data().count,
        activeCategories: activeCategoriesSnap.data().count,
        inactiveCategories: inactiveCategoriesSnap.data().count,
        totalSubcategories: totalSubcategoriesSnap.data().count,
        activeSubcategories: activeSubcategoriesSnap.data().count,
        
        totalReceipts: totalReceiptsSnap.data().count,
        pendingReceipts: pendingReceiptsSnap.data().count,
        approvedReceipts: approvedReceiptsSnap.data().count,
        rejectedReceipts: rejectedReceiptsSnap.data().count,
        
        totalActivePlans: totalActivePlansSnap.data().count,
        pendingAssignmentPlans: pendingAssignmentPlansSnap.data().count,
        scheduledPlans: scheduledPlansSnap.data().count,
        activePlans: activePlansSnap.data().count,
        expiredPlans: expiredPlansSnap.data().count,
        
        revenueCurrentMonth,
        revenueLastMonth,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('No se pudieron cargar las estadisticas del dashboard');
    }
  },

  async getTopSellers(limitCount = 5): Promise<TopSeller[]> {
    try {
      const activePlansRef = collection(db, 'active_plans');
      const q = query(activePlansRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const sellerMap = new Map<string, {
        name: string;
        storeName: string;
        profileImage: string;
        activePlansCount: number;
        totalSpent: number;
      }>();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const seller = data.seller;
        const planPrice = data.planPrice || 0;

        if (seller && seller.id) {
          const existing = sellerMap.get(seller.id);
          if (existing) {
            existing.activePlansCount += 1;
            existing.totalSpent += planPrice;
          } else {
            sellerMap.set(seller.id, {
              name: seller.name || 'Sin nombre',
              storeName: seller.storeName || 'Sin tienda',
              profileImage: seller.profileImage || '',
              activePlansCount: 1,
              totalSpent: planPrice,
            });
          }
        }
      });

      const topSellers: TopSeller[] = Array.from(sellerMap.entries())
        .map(([id, data]) => ({
          id,
          ...data,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, limitCount);

      return topSellers;
    } catch (error) {
      console.error('Error fetching top sellers:', error);
      throw new Error('No se pudieron cargar los mejores vendedores');
    }
  },
};
