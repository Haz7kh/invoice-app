import React from "react";
import Header from "../components/Header";
import { FaCheck } from "react-icons/fa";

export default function Overview() {
  return (
    <>
      <Header />
      <div className="bg-white py-16 px-6 border-5 shadow-2xl border-white ml-64">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-10">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-600">EasyInvoice</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Manage your business effortlessly with our smart invoicing system,
              built for modern companies.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  Easy Invoicing
                </h3>
                <p className="pl-9 text-gray-500">
                  Create, send, and track invoices in seconds with a
                  user-friendly interface.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  Complete Client & Company Management
                </h3>
                <p className="pl-9 text-gray-500">
                  Centralize all your customers and businesses with one
                  integrated solution.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-3 text-xl text-gray-800 font-medium">
                  <FaCheck
                    className="bg-green-500 text-white p-1 rounded-full"
                    size={20}
                  />
                  Powerful Settings & Customization
                </h3>
                <p className="pl-9 text-gray-500">
                  Choose templates, configure taxes, and personalize your
                  invoices with ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
