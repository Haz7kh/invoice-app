import React, { useEffect, useState } from "react";
import { getClients } from "../services/api";
import { Link } from "react-router-dom";
import {FaUserPlus,FaSearch} from "react-icons/fa";
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load clients");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="ml-64">
      {/* {header} */}
      <div >
        <div className="py-4 px-6 bg-gray-200 shadow-sm">
          <h2 className="text-gray-700 text-3xl font-bold">Clients - Zara</h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-around my-6 px-4">
          <div className="flex">
            <button
                  onClick={()=>setNewClient(!newClient)}
                  className={`cursor-pointer flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                >
                  <FaUserPlus className="text-white" size={18} />
                  <h3 className="text-white text-sm font-medium">New client</h3>
            </button>
            <button
                  to="#"
                  className={`cursor-pointer mx-5 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                >
                  <h3>print list of clients</h3>
            </button>
          </div>
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
      {newClient === false ? (
  <>
    <h1 className="text-2xl font-bold mb-4">Clients</h1>
    {clients.length === 0 ? (
      <p>No clients found.</p>
    ) : (
      <ul className="list-disc list-inside">
        {clients.map((c) => (
          <li key={c._id}>{c.companyName || c.name}</li>
        ))}
      </ul>
    )}
  </>
) : null}
      {newClient===true?
            <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            {/* Form Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Left Section */}
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">General</h2>
          
                {/* Type */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" />
                    <span>Company</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" />
                    <span>Person</span>
                  </label>
                </div>
          
                <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
          
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700">Company Reg. No.</label>
                    <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700">VAT No.</label>
                    <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
                  </div>
                </div>
          
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input className="bg-white w-full h-9 rounded px-3 mb-3" type="email" />
          
                {/* Invoice Method */}
                <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Send invoice by</h3>
                <div className="flex flex-wrap gap-4">
                  {["Email", "E-post + SMS", "Letter", "E-invoice"].map((method, i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input type="radio" name="sendBy" />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
          
                <label className="flex items-center gap-2 mt-4">
                  <input type="radio" />
                  <span>Always attach a PDF copy in emails</span>
                </label>
              </div>
          
              {/* Right Section */}
              <div>
                {/* Tabs */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <button className="cursor-pointer text-center font-semibold text-green-600">Billing Address</button>
                    <div className="h-0.5 bg-green-500 w-full mt-1"></div>
                  </div>
                  <button className="cursor-pointer text-center font-semibold text-gray-500">Delivery Address</button>
                </div>
          
                {/* Address Fields */}
                <label className="block text-sm font-semibold text-gray-700 md:mt-12">C/O</label>
                <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
          
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
          
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700">Zip Code</label>
                    <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold text-gray-700">City</label>
                    <input className="bg-white w-full h-9 rounded px-3 mb-3" type="text" />
                  </div>
                </div>
          
                <label className="block text-sm font-semibold text-gray-700">Country</label>
                <select className="bg-white w-full h-9 rounded px-3 mb-3 border border-gray-300 outline-none">
                  <option value="sweden">Sweden</option>
                  <option value="norway">Norway</option>
                  <option value="denmark">Denmark</option>
                </select>              
              </div>
            </div>
          
            {/* Separator */}
            <div className="my-6 border-t border-gray-300"></div>
          
            {/* Show detailed settings */}
            <h2 className="text-center text-sm font-semibold text-gray-600 mb-2 cursor-pointer hover:text-green-600 transition">Show detailed settings</h2>
            <div className="border-t border-gray-300 mb-6"></div>
          
            {/* Buttons */}
            <div className="flex justify-start gap-4">
              <button className="cursor-pointer bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition">
                Create Client
              </button>
              <button className="cursor-pointer bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </div>
          :null}

    </div>
  );
}
