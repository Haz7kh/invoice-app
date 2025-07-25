import React from "react";
import { Link } from "react-router-dom";
import {
  FaFileInvoice,
  FaCalculator,
  FaShoppingCart,
  FaUserPlus,
  FaClipboardList,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  const list = [
    {
      buttonName: t("header.buttons.new_invoice"),
      buttonIcon: <FaFileInvoice size={18} />,
      buttonColor: "bg-green-400 text-white",
      path: "/invoices",
    },
    {
      buttonName: t("header.buttons.new_estimate"),
      buttonIcon: <FaCalculator size={18} />,
      buttonColor: "bg-white text-gray-800",
      path: "/estimate",
    },
    {
      buttonName: t("header.buttons.new_order"),
      buttonIcon: <FaShoppingCart size={18} />,
      buttonColor: "bg-white text-gray-800",
      path: "/orders",
    },
    {
      buttonName: t("header.buttons.new_client"),
      buttonIcon: <FaUserPlus size={18} />,
      buttonColor: "bg-white text-gray-800",
      path: "/clients?new=true",
    },
    {
      buttonName: t("header.buttons.new_company"),
      buttonIcon: <FaClipboardList size={18} />,
      buttonColor: "bg-white text-gray-800",
      path: "/companies",
    },
  ];

  return (
    <div className="ml-64">
      {/* Top Header */}
      <div className="py-4 px-6 bg-gray-200 shadow-sm">
        <h2 className="text-gray-700 text-3xl font-bold">
          {t("header.overview")}
        </h2>
      </div>

      {/* Button List */}
      <div className="flex flex-wrap gap-4 justify-center my-6 px-4">
        {list.map((elem, index) => (
          <Link
            key={index}
            to={elem.path}
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
