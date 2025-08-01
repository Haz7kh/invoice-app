import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.token);
      navigate("/overview");
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded shadow-md w-full max-w-sm transition-colors duration-300"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          {t("login.title")}
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-400 text-red-700 dark:text-red-100 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            {t("login.email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t("login.placeholder_email")}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            {t("login.password")}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t("login.placeholder_password")}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded hover:bg-green-700 dark:hover:bg-green-800 transition duration-200"
        >
          {t("login.button")}
        </button>

        <div className="text-sm text-center mt-4">
          {t("login.no_account")}{" "}
          <span
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            {t("login.register")}
          </span>
        </div>
      </form>
    </div>
  );
}
