import React from "react";
import {FaUserPlus,FaSearch} from "react-icons/fa";
export default function Invoices() {
  return (
    <>
      <div className="ml-64">
        {/* {header} */}
        <div>
          <div className="py-4 px-6 bg-gray-200 shadow-sm">
            <h2 className="text-gray-700 text-3xl font-bold">invoice</h2>
          </div>
          <div className="flex flex-wrap gap-4 justify-around my-6 px-4">
            <div className="flex">
              <button
                    className={`cursor-pointer flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                  >
                    <FaUserPlus className="text-white" size={18} />
                    <h3 className="text-white text-sm font-medium">New client</h3>
              </button>
              <button
                    className={`cursor-pointer mx-5 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                  >
                    <h3>print list of clients</h3>
              </button>
            </div>
            <input 
              type="date"
              defaultValue="2025-01-01"
              className="bg-white  h-9 rounded px-3 mb-3 border border-gray-300 outline-none"
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-white shadow border outline-none w-64 max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
