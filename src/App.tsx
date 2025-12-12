import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./shared/hooks/useAuth";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { AdminLayout } from "./shared/components/AdminLayout";
import { LoginPage } from "./features/auth/LoginPage";
import { SignUpPage } from "./features/auth/SignUpPage";
import { CategoriesPage } from "./features/categories/CategoriesPage";
import { CategoryFormPage } from "./features/categories/CategoryFormPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/categories" replace />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/edit/:id" element={<CategoryFormPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
