import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/hooks/useAuth";
import { ModalProvider } from "./shared/hooks/useModal";
import { ModalGlobal } from "./shared/components/modal-global";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { AdminLayout } from "./shared/components/AdminLayout";
import { LoginPage } from "./features/auth/login-page";
import { DashboardPage } from "./features/dashboard/pages/dashboard-page";
import { CategoriesPage } from "./features/categories/pages/categories-page";
import { CategoryFormPage } from "./features/categories/pages/category-form-page";
import { SubcategoryFormPage } from "./features/categories/pages/subcategory-form-page";
import { UsersPage } from "./features/users/pages/users-page";
import UserFormPage from "./features/users/pages/user-form-page";
import UserProfilePage from "./features/users/pages/user-profile-page";
import { PlanVideoPage } from "./features/plans/pages/plan-video-page";
import { PlanAdvertisingPage } from "./features/plans/pages/plan-advertising-page";
import { PlanLivesPage } from "./features/plans/pages/plan-lives-page";
import { PaymentReceiptsPage } from "./features/payment-receipts/pages/payment-receipts-page";
import { PaymentQRPage } from "./features/payment-settings/pages/payment-qr-page";
import { OrdersTrackingPage } from "./features/orders/pages/orders-tracking-page";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <ModalGlobal />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:id/edit" element={<UserFormPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/new" element={<CategoryFormPage />} />
              <Route path="categories/:id/edit" element={<CategoryFormPage />} />
              <Route path="categories/:categoryId/subcategory/new" element={<SubcategoryFormPage />} />
              <Route path="categories/:categoryId/subcategories/:id/edit" element={<SubcategoryFormPage />} />
              <Route path="plans/video" element={<PlanVideoPage />} />
              <Route path="plans/advertising" element={<PlanAdvertisingPage />} />
              <Route path="plans/lives" element={<PlanLivesPage />} />
              <Route path="payment-receipts" element={<PaymentReceiptsPage />} />
              <Route path="payment-qr" element={<PaymentQRPage />} />
              <Route path="orders" element={<OrdersTrackingPage />} />

            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
