import React from "react";
import { useTranslation } from "react-i18next";

export default function InvoiceCustomerFields({
  invoice,
  customers,
  handleChange,
  companies,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded border mb-8">
      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.invoice_from")}
        </label>
        <select
          name="companyFrom"
          value={invoice.companyFrom}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">{t("invoiceCustomerFields.select_company")}</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.client")}
        </label>
        <select
          name="customer"
          value={invoice.customer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">{t("invoiceCustomerFields.select_customer")}</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.invoice_no")}
        </label>
        <input
          name="invoiceNumber"
          value={invoice.invoiceNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.your_reference")}
        </label>
        <input
          name="yourReference"
          value={invoice.yourReference}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.invoice_date")}
        </label>
        <input
          type="date"
          name="invoiceDate"
          value={invoice.invoiceDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.payment_terms")}
        </label>
        <input
          type="number"
          name="paymentTerms"
          value={invoice.paymentTerms}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.due_date")}
        </label>
        <input
          type="date"
          name="dueDate"
          value={invoice.dueDate}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.our_reference")}
        </label>
        <input
          name="ourReference"
          value={invoice.ourReference}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.language")}
        </label>
        <select
          name="language"
          value={invoice.language}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="sv">Swedish</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">
          {t("invoiceCustomerFields.currency")}
        </label>
        <input
          name="currency"
          value={invoice.currency}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
}
