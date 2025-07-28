import React, { useEffect, useState } from "react";
import { getCompanies } from "../../services/api";
import CompanyForm from "./CompanyForm";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Companies() {
  const { t } = useTranslation();

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
      setError(err.message || t("companies.errors.fetch_failed"));
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
    toast.success(t("companies.toast.saved"));
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
    if (!window.confirm(t("companies.confirm_delete"))) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/companies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(t("companies.errors.delete_failed"));

      fetchCompanies();
      toast.success(t("companies.toast.deleted"));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(t("companies.errors.delete_failed"));
    }
  };

  if (loading) return <div className="ml-64 p-6">{t("loading")}</div>;
  if (error)
    return <div className="ml-64 p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {t("companies.title")}
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditMode(false);
            setEditingCompany(null);
          }}
          className="cursor-pointer bg-[#3D365C] hover:bg-[#7C4585] text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
        >
          {showForm && !editMode
            ? t("common.cancel")
            : t("companies.add_button")}
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
      {/* Company List */}
      {companies.length === 0 ? (
        <p className="text-gray-500">{t("companies.empty")}</p>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition relative"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="text-blue-600 hover:text-blue-800"
                  title={t("common.edit")}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="text-red-500 hover:text-red-700"
                  title={t("common.delete")}
                >
                  <FaTrash />
                </button>
              </div>

              {/* Company Name */}
              <h3 className="text-xl font-semibold text-[#3D365C] mb-2">
                {company.companyName}
              </h3>

              {/* Company Details List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">
                    {t("companies.labels.org_number")}:
                  </span>{" "}
                  {company.orgNumber || "-"}
                </div>
                <div>
                  <span className="font-medium">
                    {t("companies.labels.vat")}:
                  </span>{" "}
                  {company.vatNumber || "-"}
                </div>
                <div>
                  <span className="font-medium">
                    {t("companies.labels.email")}:
                  </span>{" "}
                  <a
                    href={`mailto:${company.email}`}
                    className="text-blue-600 underline"
                  >
                    {company.email || "-"}
                  </a>
                </div>
                <div>
                  <span className="font-medium">
                    {t("companies.labels.bankgiro")}:
                  </span>{" "}
                  {company.bankgiro || "-"}
                </div>
                <div>
                  <span className="font-medium">
                    {t("companies.labels.city")}:
                  </span>{" "}
                  {company.billingAddress?.city || "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
