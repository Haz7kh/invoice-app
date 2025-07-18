import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="flex min-h-screen">
      {/* Show Sidebar only when logged in */}
      {token && !isLoginPage && <Sidebar />}

      {/* Main content area */}
      <main className="flex-grow bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
