import React, { useEffect, useState } from "react";
import { getCompanies } from "../../services/api";
import CompanyForm from "./CompanyForm";
import { FaTrash } from "react-icons/fa";
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
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete company");

      fetchCompanies(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete company.");
    }
  };

  if (loading) return <div className="ml-64 p-6">Loading...</div>;
  if (error)
    return <div className="ml-64 p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Companies</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setEditingCompany(null);
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          {showForm && !editMode ? "Cancel" : "+ Add New Company"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <CompanyForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialData={editMode ? editingCompany : null}
          />
        </div>
      )}

      {/* List */}
      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        companies.map((company) => (
          <div
            key={company._id}
            className="bg-white p-4 rounded border border-gray-300 mb-4 relative"
          >
            <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
              <button
                onClick={() => handleEdit(company)}
                className="text-gray-500 hover:text-blue-600 text-lg"
                title="Edit Company"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(company._id)}
                className="text-red-500 hover:text-red-700 text-lg"
                title="Delete Company"
              >
                🗑️
              </button>
            </div>

            <p>
              <strong>Name:</strong> {company.companyName}
            </p>
            <p>
              <strong>Org Number:</strong> {company.orgNumber}
            </p>
            <p>
              <strong>VAT Number:</strong> {company.vatNumber}
            </p>
            <p>
              <strong>Email:</strong> {company.email}
            </p>
            <p>
              <strong>Bankgiro:</strong> {company.bankgiro}
            </p>
            <p>
              <strong>City:</strong> {company.billingAddress?.city}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
