import React, { useState, useEffect } from "react";
import { getClients } from "../services/api";
import ProductAutocompleteInput from "./ProductAutocompleteInput";

export default function InvoiceForm({ onCancel, onSubmit }) {
  const [invoice, setInvoice] = useState({
    customer: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: 30,
    yourReference: "",
    ourReference: "",
    language: "sv",
    currency: "SEK",
    notes: "",
    items: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getClients();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!invoice.invoiceDate || !invoice.paymentTerms) return;
    const date = new Date(invoice.invoiceDate);
    date.setDate(date.getDate() + parseInt(invoice.paymentTerms, 10));
    setInvoice((prev) => ({
      ...prev,
      dueDate: date.toISOString().split("T")[0],
    }));
  }, [invoice.invoiceDate, invoice.paymentTerms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "invoiceDate") {
      const parsed = new Date(value);
      if (!isNaN(parsed)) newValue = parsed.toISOString().split("T")[0];
    }

    setInvoice((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const calculateTotals = () => {
    let net = 0,
      vat = 0;
    invoice.items.forEach(
      ({ quantity = 0, price = 0, discountPercent = 0, vatPercent = 0 }) => {
        const line = price * quantity;
        const netLine = line * (1 - discountPercent / 100);
        net += netLine;
        vat += netLine * (vatPercent / 100);
      }
    );
    return {
      netTotal: net.toFixed(2),
      vatTotal: vat.toFixed(2),
      grandTotal: (net + vat).toFixed(2),
    };
  };

  const { netTotal, vatTotal, grandTotal } = calculateTotals();

  const addNewItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          product: "",
          text: "",
          quantity: 1,
          unit: "",
          price: 0,
          vatPercent: 25,
          discountPercent: 0,
        },
      ],
    }));
  };

  const handleSubmit = async () => {
    if (
      !invoice.customer ||
      !invoice.invoiceNumber ||
      !invoice.invoiceDate ||
      invoice.items.length === 0
    ) {
      // Optional: alert("Please fill all required fields and add at least one item.");
      return;
    }

    setIsSubmitting(true);
    if (typeof onSubmit === "function") {
      onSubmit(invoice);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="ml-64 p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>
      <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded border">
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

      {/* Items Table */}
      <div className="mt-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Product / Service</th>
              <th className="p-2 border">Text</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">VAT%</th>
              <th className="p-2 border">Discount</th>
              <th className="p-2 border">Net</th>
              <th className="p-2 border">❌</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => {
              const qty = parseFloat(item.quantity || 0);
              const price = parseFloat(item.price || 0);
              const disc = item.discountPercent || 0;
              const netLine = (price * qty * (1 - disc / 100)).toFixed(2);

              return (
                <tr key={i}>
                  <td className="p-2 border">
                    <ProductAutocompleteInput
                      onSelect={(prod) => {
                        const updated = [...invoice.items];
                        updated[i] = {
                          ...updated[i],
                          productId: prod._id,
                          product: prod.name,
                          unit: prod.unit,
                          price: prod.price,
                          vatPercent: prod.tax,
                        };
                        setInvoice({ ...invoice, items: updated });
                      }}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={item.text || ""}
                      onChange={(e) => {
                        const u = [...invoice.items];
                        u[i].text = e.target.value;
                        setInvoice({ ...invoice, items: u });
                      }}
                      className="w-full border p-1"
                      placeholder="Extra info"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const u = [...invoice.items];
                        u[i].quantity = parseFloat(e.target.value) || 0;
                        setInvoice({ ...invoice, items: u });
                      }}
                      className="w-16 border p-1"
                    />
                  </td>
                  <td className="p-2 border">{item.unit}</td>
                  <td className="p-2 border">{item.price}</td>
                  <td className="p-2 border">{item.vatPercent}%</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.discountPercent}
                      onChange={(e) => {
                        const u = [...invoice.items];
                        u[i].discountPercent = parseFloat(e.target.value) || 0;
                        setInvoice({ ...invoice, items: u });
                      }}
                      className="w-16 border p-1"
                    />
                  </td>
                  <td className="p-2 border">{netLine}</td>
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const u = [...invoice.items];
                        u.splice(i, 1);
                        setInvoice({ ...invoice, items: u });
                      }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between mt-4">
          <button
            onClick={addNewItem}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + New row
          </button>
          <div className="text-right space-y-1">
            <div>
              <strong>Net:</strong> {netTotal} {invoice.currency}
            </div>
            <div>
              <strong>VAT:</strong> {vatTotal} {invoice.currency}
            </div>
            <div>
              <strong>Total:</strong> {grandTotal} {invoice.currency}
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Buttons */}
      <div className="mt-6">
        <label className="block font-medium mb-1">Notes:</label>
        <textarea
          name="notes"
          rows="3"
          value={invoice.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className={`${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          } bg-green-600 text-white px-6 py-2 rounded`}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Saving..." : "Create Invoice"}
        </button>
        <button
          className="px-6 py-2 border rounded"
          onClick={() => {
            if (typeof onCancel === "function") onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
