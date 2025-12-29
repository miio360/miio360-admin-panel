import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/hooks/useAuth";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { AdminLayout } from "./shared/components/AdminLayout";
import { LoginPage } from "./features/auth/login-page";
import { DashboardPage } from "./features/dashboard/dashboard-page";
import { CategoriesPage } from "./features/categories/categories-page";
import { CategoryFormPage } from "./features/categories/category-form-page";
import { SubcategoryFormPage } from "./features/categories/subcategory-form-page";
import { UsersPage } from "./features/users/users-page";
import UserFormPage from "./features/users/user-form-page";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
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
            <Route path="users/new" element={<UserFormPage />} />
            <Route path="users/:id/edit" element={<UserFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/:id/edit" element={<CategoryFormPage />} />
            <Route path="categories/:categoryId/subcategory/new" element={<SubcategoryFormPage />} />
            <Route path="categories/:categoryId/subcategories/:id/edit" element={<SubcategoryFormPage />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
