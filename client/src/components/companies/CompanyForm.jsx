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
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block font-semibold mb-1">
          {t("company_form.company_name")}
        </label>
        <input
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block font-semibold mb-1">
          {t("company_form.org_number")}
        </label>
        <input
          name="orgNumber"
          value={formData.orgNumber}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block font-semibold mb-1">
          {t("company_form.vat_number")}
        </label>
        <input
          name="vatNumber"
          value={formData.vatNumber}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block font-semibold mb-1">
          {t("company_form.email")}
        </label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block font-semibold mb-1">
          {t("company_form.bankgiro")}
        </label>
        <input
          name="bankgiro"
          value={formData.bankgiro}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block font-semibold mb-1">
          {t("company_form.send_by")}
        </label>
        <select
          name="sendBy"
          value={formData.sendBy}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        >
          <option value="email">{t("company_form.send_options.email")}</option>
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="attachPdf"
            checked={formData.attachPdf}
            onChange={handleChange}
          />
          {t("company_form.attach_pdf")}
        </label>
      </div>

      <div>
        <h3 className="font-semibold mb-2">{t("company_form.billing")}</h3>
        <label className="block mb-1">{t("company_form.co")}</label>
        <input
          name="billingAddress.co"
          value={formData.billingAddress.co}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-1">{t("company_form.address")}</label>
        <input
          name="billingAddress.address"
          value={formData.billingAddress.address}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-1">{t("company_form.city")}</label>
        <input
          name="billingAddress.city"
          value={formData.billingAddress.city}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-1">{t("company_form.zip_code")}</label>
        <input
          name="billingAddress.zipCode"
          value={formData.billingAddress.zipCode}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block mb-1">{t("company_form.country")}</label>
        <input
          name="billingAddress.country"
          value={formData.billingAddress.country}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full mb-3"
        />
      </div>

      <div className="col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          {initialData
            ? t("company_form.update_button")
            : t("company_form.create_button")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg"
        >
          {t("company_form.cancel_button")}
        </button>
      </div>
    </form>
  );
}
