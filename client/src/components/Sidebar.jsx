import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiUser,
  HiDocumentText,
  HiOutlineClipboardList,
  HiShoppingBag,
  HiCog,
  HiOfficeBuilding,
} from "react-icons/hi";

import logo from "../assets/Invoicelogowhite.svg";
import { getCurrentUserData } from "../services/api";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUserData();
      setUser(userData);
    };

    fetchUser();
  }, []);

  const navItems = [
    {
      name: t("sidebar.overview"),
      path: "/overview",
      icon: <HiHome size={20} />,
    },
    {
      name: t("sidebar.clients"),
      path: "/clients",
      icon: <HiUser size={20} />,
    },
    {
      name: t("sidebar.companies"),
      path: "/companies",
      icon: <HiOfficeBuilding size={20} />,
    },
    {
      name: t("sidebar.invoices"),
      path: "/invoices",
      icon: <HiDocumentText size={20} />,
    },
    {
      name: t("sidebar.orders"),
      path: "/orders",
      icon: <HiOutlineClipboardList size={20} />,
    },
    {
      name: t("sidebar.products"),
      path: "/products",
      icon: <HiShoppingBag size={20} />,
    },
    {
      name: t("sidebar.settings"),
      path: "/settings",
      icon: <HiCog size={20} />,
    },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-[#3D365C] text-gray-100 fixed print:hidden">
      {/* Logo */}
      <div className="p-4 flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md hover:bg-[#7C4585] ${
                isActive ? "bg-[#7C4585] font-semibold" : ""
              }`
            }
          >
            <span className="mr-3">{icon}</span>
            {name}
          </NavLink>
        ))}

        {/* ✅ Language Switcher now lives under the nav items */}
        <div className="pt-4 border-t border-gray-700">
          <LanguageSwitcher />
        </div>
        <div className="mt-4 px-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">
              {t("sidebar.toggle_theme") || "Dark Mode"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={() =>
                  document.documentElement.classList.toggle("dark")
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-secondary dark:peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>
        </div>
      </nav>

      {/* User & Language */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        {/* User Profile Dropdown */}
        <button
          className="flex items-center space-x-3 w-full"
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        >
          <div className="rounded-full bg-[#7C4585] h-8 w-8 flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold">
              {user?.name || t("sidebar.unknown")}
            </span>
          </div>
          <svg
            className={`ml-auto h-4 w-4 transition-transform ${
              userDropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {userDropdownOpen && (
          <div className="text-sm space-y-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2 py-1 hover:bg-[#7C4585] rounded"
            >
              {t("sidebar.logout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
