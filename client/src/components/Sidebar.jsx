import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiUser,
  HiDocumentText,
  HiOutlineClipboardList,
  HiShoppingBag,
  HiCog,
} from "react-icons/hi";

import logo from "../assets/Invoicelogowhite.svg";
import { getCurrentUserData, getCompany } from "../services/api"; // ✅ API call

const navItems = [
  { name: "Overview", path: "/overview", icon: <HiHome size={20} /> },
  { name: "Clients", path: "/clients", icon: <HiUser size={20} /> },
  { name: "Invoices", path: "/invoices", icon: <HiDocumentText size={20} /> },
  {
    name: "Orders",
    path: "/orders",
    icon: <HiOutlineClipboardList size={20} />,
  },
  { name: "Products", path: "/products", icon: <HiShoppingBag size={20} /> },
  { name: "Settings", path: "/settings", icon: <HiCog size={20} /> },
];

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUserData();

      let companyData = null;
      try {
        companyData = await getCompany();
      } catch (error) {
        console.log("No company found yet", error);
      }

      setUser(userData);
      setCompany(companyData); // null if user has no company
    };

    fetchUser();
  }, []);

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
    <div className="flex flex-col w-64 h-screen bg-gray-800 text-gray-100">
      <div className="p-4 flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
          >
            <span className="mr-3">{icon}</span>
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          className="flex items-center space-x-3 w-full"
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        >
          <div className="rounded-full bg-gray-600 h-8 w-8 flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold">
              {user?.name || "Unknown"}
            </span>
            <span className="text-xs text-gray-400">
              {company?.companyName || "No Company"}
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
          <div className="mt-2 text-sm">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
