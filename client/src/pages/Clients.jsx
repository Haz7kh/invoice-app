import React, { useEffect, useState } from "react";
import { getClients } from "../services/api";
import { Link } from "react-router-dom";
import {FaUserPlus,FaSearch} from "react-icons/fa";
export default function Clients() {
  const [clients, setClients] = useState([]);
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
    <div className="">
      <div >
        <div className="py-4 px-6 bg-gray-200 shadow-sm">
          <h2 className="text-gray-700 text-3xl font-bold">Clients - Zara</h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-around my-6 px-4">
          <div className="flex">
            <Link
                  to="#"
                  className={`flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                >
                  <FaUserPlus className="text-white" size={18} />
                  <h3 className="text-white text-sm font-medium">New client</h3>
            </Link>
            <Link
                  to="#"
                  className={`mx-5 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition`}
                >
                  <h3>print list of clients</h3>
            </Link>
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
    </div>
  );
}
