import React, { useState, useEffect } from "react";

import { FaSearch, FaFileInvoice } from "react-icons/fa";
export default function Invoices() {
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [filteredInvoices, setFilteredInvoices] = useState([]); // your displayed invoices
  const [allInvoices, setAllInvoices] = useState([]); // raw data

  const handleYearChange = (newYear) => {
    setYear(newYear);
    setStartDate(`${newYear}-01-01`);
    setEndDate(`${newYear}-12-31`);
  };

  useEffect(() => {
    // Replace with your actual API call
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        setAllInvoices(data);
        setFilteredInvoices(data); // initially show all
      });
  }, []);

  useEffect(() => {
    handleFilter(); // re-filter when date range changes
  }, [startDate, endDate]);

  const handleFilter = () => {
    const filtered = allInvoices.filter((inv) => {
      const date = new Date(inv.date); // assuming invoice has a `date` field
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    setFilteredInvoices(filtered);
  };

  return (
    <>
      <div className="ml-64">
        {/* {header} */}
        <div>
          <div className="py-4 px-6 bg-gray-200 shadow-sm">
            <h2 className="text-gray-700 text-3xl font-bold">invoice</h2>
          </div>
          <div className="flex flex-wrap gap-4 items-center justify-between my-6 px-6">
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">
              <FaFileInvoice />
              <span>New invoice</span>
            </button>

            <button className="cursor-pointer mx-5 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
              <h3>Report / export</h3>
            </button>

            <div className="flex items-center gap-2 border px-4 py-2 rounded">
              <button
                onClick={() => handleYearChange((+year - 1).toString())}
                className="text-gray-500 hover:text-gray-800"
              >
                ⬅️
              </button>
              <span className="text-green-600 font-semibold">{year}</span>
              <button
                onClick={() => handleYearChange((+year + 1).toString())}
                className="text-gray-500 hover:text-gray-800"
              >
                ➡️
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>

            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 rounded-full border outline-none w-64 max-w-full focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
