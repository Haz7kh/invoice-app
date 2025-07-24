import React from "react";

export default function InvoiceCustomerFields({
  invoice,
  customers,
  handleChange,
  companies,
}) {
  return (
    <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded border mb-8">
      <div>
        <label className="block font-medium">Invoice From (Company)</label>
        <select
          name="companyFrom"
          value={invoice.companyFrom}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Company…</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Client</label>
        <select
          name="customer"
          value={invoice.customer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Customer…</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium">Invoice no.</label>
        <input
          name="invoiceNumber"
          value={invoice.invoiceNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Your reference</label>
        <input
          name="yourReference"
          value={invoice.yourReference}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Invoice date</label>
        <input
          type="date"
          name="invoiceDate"
          value={invoice.invoiceDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Payment terms (days)</label>
        <input
          type="number"
          name="paymentTerms"
          value={invoice.paymentTerms}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Due date</label>
        <input
          type="date"
          name="dueDate"
          value={invoice.dueDate}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block font-medium">Our reference</label>
        <input
          name="ourReference"
          value={invoice.ourReference}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Language</label>
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
        <label className="block font-medium">Currency</label>
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
