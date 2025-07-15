import "./App.css";
import HomePage from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import * as React from "react";
import AdminLayout from "./layout/admin/AdminLayout.tsx";
import AdminDashboardPage from "./pages/admin/Dashboard";
import AdminNotFoundPage from "./pages/admin/NotFound";
import AddCategoryPage from "./pages/AddCategoryPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditCategoryPage from "./pages/EditCategoryPage";
import ProfilePage from "./pages/Profile";
import PasswordResetRequest from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import CategoryProductsPage from "./pages/CategoryProductsPage/index.tsx";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={"add-category"} element={<AddCategoryPage />} />
          <Route path="edit-category/:id" element={<EditCategoryPage />} />
          <Route path={"login"} element={<LoginPage />} />
          <Route path={"register"} element={<RegisterPage />} />
          <Route path={"profile"} element={<ProfilePage />} />
          <Route path={"password-reset"} element={<PasswordResetRequest />} />
          <Route
            path="password-reset-confirm/:uid/:token"
            element={<PasswordResetConfirm />}
          />
          <Route
            path="category/:id/products"
            element={<CategoryProductsPage />}
          />
          <Route
            path="/category/:id/products/add"
            element={<AddProductPage />}
          />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
        </Route>

        <Route path={"admin"} element={<AdminLayout />}>
          <Route path="home" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<AdminNotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
