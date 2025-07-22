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
import Register from "./pages/Register";
import InvoicePrint from "./pages/InvoicePrint";
import CompanyList from "./components/companies/CompanyList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";
  const isPrintPage = location.pathname.startsWith("/print/");

  return (
    <div className={`min-h-screen ${isPrintPage ? "" : "flex"}`}>
      {/* ✅ Sidebar only on authenticated, non-print views */}
      {token && !isLoginPage && !isPrintPage && <Sidebar />}

      {/* ✅ Main content layout */}
      <main
        className={`flex-grow bg-gray-100 p-6 ${
          isPrintPage ? "w-full max-w-none p-0 bg-white" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/print/:id" element={<InvoicePrint />} />
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
            path="/companies"
            element={
              <ProtectedRoute>
                <CompanyList />
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
      {/* ✅ Toast messages globally */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
