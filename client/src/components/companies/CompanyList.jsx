import React, { useEffect, useState } from "react";
import { getCompanies } from "../../services/api";
import CompanyForm from "./CompanyForm";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSuccess = () => {
    fetchCompanies();
    setShowForm(false);
    setEditingCompany(null);
    setEditMode(false);
    toast.success("Company saved successfully!");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
    setEditMode(false);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete company");

      fetchCompanies();
      toast.success("Company deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete company.");
    }
  };

  if (loading) return <div className="ml-64 p-6">Loading...</div>;
  if (error) return <div className="ml-64 p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Companies</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setEditingCompany(null);
          }}
          className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          {showForm && !editMode ? "Cancel" : "+ Add Company"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-8 border border-gray-200">
          <CompanyForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialData={editMode ? editingCompany : null}
          />
        </div>
      )}

      {/* List */}
      {companies.length === 0 ? (
        <p className=" text-gray-500 ">No companies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-xl shadow border border-gray-200 p-5 relative"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="cursor-pointer text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {company.companyName}
              </h3>

              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Org Number:</strong> {company.orgNumber}
                </li>
                <li>
                  <strong>VAT:</strong> {company.vatNumber}
                </li>
                <li className="text-blue-500">
                  <strong className="text-gray-600">Email:</strong> {company.email}
                </li>
                <li>
                  <strong>Bankgiro:</strong> {company.bankgiro}
                </li>
                <li>
                  <strong>City:</strong> {company.billingAddress?.city}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
