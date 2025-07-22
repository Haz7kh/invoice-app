import React, { useState, useEffect } from "react";
import { getClients } from "../services/api";
import ProductAutocompleteInput from "./ProductAutocompleteInput";

// Import new components (will create these step-by-step)
import InvoiceCustomerFields from "./invoice-form/InvoiceCustomerFields";
import InvoiceItemsTable from "./invoice-form/InvoiceItemsTable";
import InvoiceTotals from "./invoice-form/InvoiceTotals";
import InvoiceNotes from "./invoice-form/InvoiceNotes";
import InvoiceFormButtons from "./invoice-form/InvoiceFormButtons";

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
          type: "product", // ✅ IMPORTANT: So totals are calculated correctly
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
      return;
    }

    const allItems = invoice.items;

    // Calculate totals, only product rows
    let net = 0;
    let vat = 0;

    allItems.forEach((item) => {
      if (item.type === "text") return;

      const quantity = Number(item.quantity ?? 0);
      const price = Number(item.price ?? 0);
      const discount = Number(item.discountPercent ?? 0);
      const vatPercent = Number(item.vatPercent ?? 0);

      if (
        isNaN(quantity) ||
        isNaN(price) ||
        isNaN(discount) ||
        isNaN(vatPercent)
      ) {
        return; // Skip invalid rows
      }

      const line = price * quantity;
      const netLine = line * (1 - discount / 100);
      net += netLine;
      vat += netLine * (vatPercent / 100);
    });

    console.log("🧾 Calculated totals:", {
      net,
      vat,
      netTotal: Number(net.toFixed(2)),
      vatTotal: Number(vat.toFixed(2)),
      grandTotal: Number((net + vat).toFixed(2)),
    });

    console.log("📦 All invoice items:", allItems);
    const invoiceData = {
      ...invoice,
      items: allItems, // include both product and text rows
      netTotal: Number(net.toFixed(2)),
      vatTotal: Number(vat.toFixed(2)),
      grandTotal: Number((net + vat).toFixed(2)),
    };

    setIsSubmitting(true);
    if (typeof onSubmit === "function") {
      onSubmit(invoiceData);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="ml-64 p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Create Invoice</h1>

      {/* Customer and invoice details */}
      <InvoiceCustomerFields
        invoice={invoice}
        customers={customers}
        handleChange={handleChange}
      />

      {/* Items Table */}
      <InvoiceItemsTable
        items={invoice.items}
        setInvoice={setInvoice}
        invoice={invoice}
        addNewItem={addNewItem}
      />

      {/* Totals */}
      <InvoiceTotals
        netTotal={netTotal}
        vatTotal={vatTotal}
        grandTotal={grandTotal}
        currency={invoice.currency}
      />

      {/* Notes */}
      <InvoiceNotes notes={invoice.notes} handleChange={handleChange} />

      {/* Buttons */}
      <InvoiceFormButtons
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
