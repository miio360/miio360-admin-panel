export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalCouriers: number;
  totalCustomers: number;
  activeUsers: number;
  pendingVerification: number;
  suspendedUsers: number;
  
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalSubcategories: number;
  activeSubcategories: number;
  
  totalReceipts: number;
  pendingReceipts: number;
  approvedReceipts: number;
  rejectedReceipts: number;
  
  totalActivePlans: number;
  pendingAssignmentPlans: number;
  scheduledPlans: number;
  activePlans: number;
  expiredPlans: number;
  
  revenueCurrentMonth: number;
  revenueLastMonth: number;
}

export interface RecentActivity {
  type: 'user_created' | 'receipt_approved' | 'receipt_rejected' | 'plan_activated' | 'category_created';
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

export interface TopSeller {
  id: string;
  name: string;
  storeName: string;
  profileImage: string;
  activePlansCount: number;
  totalSpent: number;
}
