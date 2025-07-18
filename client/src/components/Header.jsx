import React from "react";
import { Link } from "react-router-dom";
import {
  FaFileInvoice,
  FaCalculator,
  FaShoppingCart,
  FaUserPlus,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";

export default function Header() {
  const list = [
    {
      buttonName: "New invoice",
      buttonIcon: <FaFileInvoice size={18} />,
      buttonColor: "bg-green-400 text-white",
    },
    {
      buttonName: "New estimate",
      buttonIcon: <FaCalculator size={18} />,
      buttonColor: "bg-white text-gray-800",
    },
    {
      buttonName: "New order",
      buttonIcon: <FaShoppingCart size={18} />,
      buttonColor: "bg-white text-gray-800",
    },
    {
      buttonName: "New client",
      buttonIcon: <FaUserPlus size={18} />,
      buttonColor: "bg-white text-gray-800",
    },
    {
      buttonName: "Nytt bososs",
      buttonIcon: <FaClipboardList size={18} />,
      buttonColor: "bg-white text-gray-800",
    },
    {
      buttonName: "Ny bodsaa",
      buttonIcon: <FaBoxOpen size={18} />,
      buttonColor: "bg-white text-gray-800",
    },
  ];

  return (
    <div className="m-0">
      {/* Top Header */}
      <div className="py-4 px-6 bg-gray-200 shadow-sm">
        <h2 className="text-gray-700 text-3xl font-bold">Overview - Zara</h2>
      </div>

      {/* Button List */}
      <div className="flex flex-wrap gap-4 justify-center my-6 px-4">
        {list.map((elem, index) => (
          <Link
            key={index}
            to={`/${elem.buttonName}`}
            className={`flex items-center gap-2 ${elem.buttonColor} px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
          >
            {elem.buttonIcon}
            <h3 className="text-sm font-medium">{elem.buttonName}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
