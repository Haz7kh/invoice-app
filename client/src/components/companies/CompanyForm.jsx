import React, { useState, useEffect } from "react";
import { saveCompany, updateCompany } from "../../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function CompanyForm({
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    type: "company",
    companyName: "",
    orgNumber: "",
    vatNumber: "",
    email: "",
    sendBy: "email",
    attachPdf: false,
    bankgiro: "",
    billingAddress: {
      co: "",
      address: "",
      zipCode: "",
      city: "",
      country: "Sweden",
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        billingAddress: {
          ...prev.billingAddress,
          ...initialData.billingAddress,
        },
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("billingAddress.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [key]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData?._id) {
        await updateCompany(initialData._id, formData);
        toast.success(t("company_form.updated"));
      } else {
        await saveCompany(formData);
        toast.success(t("company_form.created"));
      }
      onSuccess?.();
    } catch (err) {
      console.error("Company form error:", err);
      toast.error(t("company_form.error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-5xl mx-auto p-10 rounded-2xl shadow-lg border border-muted space-y-10"
    >
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t("company_form.title")}
        </h1>
        <p className="text-muted text-sm">
          {t("company_form.subtitle") ||
            "Enter company billing and identity info"}
        </p>
      </div>

      {/* Company Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary border-b border-muted pb-1 mb-4">
            {t("company_form.company_info")}
          </h2>

          {[
            ["companyName", "company_form.company_name"],
            ["orgNumber", "company_form.org_number"],
            ["vatNumber", "company_form.vat_number"],
            ["email", "company_form.email"],
            ["bankgiro", "company_form.bankgiro"],
          ].map(([name, labelKey]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-primary mb-1">
                {t(labelKey)}
              </label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={t(labelKey)}
                className="w-full px-4 py-2 border border-muted rounded-lg bg-white text-black placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t("company_form.send_by")}
            </label>
            <select
              name="sendBy"
              value={formData.sendBy}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-muted rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="email">
                {t("company_form.send_options.email")}
              </option>
              <option value="e-post_sms">
                {t("company_form.send_options.email_sms")}
              </option>
              <option value="letter">
                {t("company_form.send_options.letter")}
              </option>
              <option value="e-invoice">
                {t("company_form.send_options.e_invoice")}
              </option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary font-medium mt-1">
            <input
              type="checkbox"
              name="attachPdf"
              checked={formData.attachPdf}
              onChange={handleChange}
              className="accent-accent"
            />
            {t("company_form.attach_pdf")}
          </label>
        </div>

        {/* Billing Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-secondary border-b border-muted pb-1 mb-4">
            {t("company_form.billing")}
          </h2>

          {[
            ["co", "company_form.co"],
            ["address", "company_form.address"],
            ["city", "company_form.city"],
            ["zipCode", "company_form.zip_code"],
            ["country", "company_form.country"],
          ].map(([key, labelKey]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-primary mb-1">
                {t(labelKey)}
              </label>
              <input
                name={`billingAddress.${key}`}
                value={formData.billingAddress[key]}
                onChange={handleChange}
                placeholder={t(labelKey)}
                className="w-full px-4 py-2 border border-muted rounded-lg bg-white text-black placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-muted">
        <button
          type="button"
          onClick={onCancel}
          className="bg-muted hover:bg-highlight text-black font-medium px-6 py-2 rounded-lg transition"
        >
          {t("company_form.cancel_button")}
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-medium px-6 py-2 rounded-lg transition"
        >
          {initialData
            ? t("company_form.update_button")
            : t("company_form.create_button")}
        </button>
      </div>
    </form>
  );
}
