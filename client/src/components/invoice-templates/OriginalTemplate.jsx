import React from "react";

export default function OriginalTemplate({ invoice }) {
  if (!invoice) return null;

  return (
    <div className="p-8 text-black text-sm font-sans bg-white max-w-[800px] mx-auto border border-gray-300 shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <p className="text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
          <p className="text-gray-600">Date: {invoice.invoiceDate}</p>
          <p className="text-gray-600">Due: {invoice.dueDate}</p>
        </div>

        <div className="text-right">
          <h2 className="font-bold text-lg">Your Company</h2>
          <p className="text-sm text-gray-700">Address Line 1</p>
          <p className="text-sm text-gray-700">Address Line 2</p>
        </div>
      </div>
    </div>
  );
}
