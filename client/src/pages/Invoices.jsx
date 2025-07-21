/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaSearch, FaFileInvoice } from "react-icons/fa";
import InvoiceForm from "../components/InvoiceForm";
import { getInvoices, createInvoice } from "../services/api";

export default function Invoices() {
  const [year, setYear] = useState("2025");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Change year and auto-update date range
  const handleYearChange = (newYear) => {
    setYear(newYear);
    setStartDate(`${newYear}-01-01`);
    setEndDate(`${newYear}-12-31`);
  };

  // Fetch all invoices on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getInvoices();
        setAllInvoices(data);
        setFilteredInvoices(data);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    })();
  }, []);

  // Filter by date range
  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const handleFilter = () => {
    const filtered = allInvoices.filter((inv) => {
      const date = new Date(inv.invoiceDate);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    setFilteredInvoices(filtered);
  };

  // Handle invoice creation from form
  const handleFormSubmit = async (invoiceData) => {
    try {
      setLoading(true);
      const newInvoice = await createInvoice(invoiceData);

      // Avoid duplicate push if already exists
      if (allInvoices.some((inv) => inv._id === newInvoice._id)) {
        return;
      }

      console.log("Invoice created!");
      setAllInvoices([newInvoice, ...allInvoices]);
      setFilteredInvoices([newInvoice, ...filteredInvoices]);
      setShowForm(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error saving invoice";
      console.error("Error saving invoice:", error, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64">
      <div className="py-4 px-6 bg-gray-200 shadow-sm">
        <h2 className="text-gray-700 text-3xl font-bold">Invoices</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between my-6 px-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        >
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

      {showForm && (
        <div className="px-6">
          <InvoiceForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="px-6">
        {filteredInvoices.length === 0 ? (
          <p className="text-gray-500">
            No invoices found for the selected date range.
          </p>
        ) : (
          <table className="w-full border-collapse mt-4 shadow-md bg-white rounded">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="p-3">{invoice.invoiceNumber || index + 1}</td>
                  <td className="p-3">
                    {invoice.customer?.companyName ||
                      invoice.customer?.email ||
                      "Unknown"}
                  </td>
                  <td className="p-3">
                    {invoice.invoiceDate
                      ? new Date(invoice.invoiceDate).toLocaleDateString()
                      : "No Date"}
                  </td>
                  <td className="p-3">
                    {invoice.grandTotal
                      ? `${invoice.grandTotal.toFixed(2)} ${
                          invoice.currency || "SEK"
                        }`
                      : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
