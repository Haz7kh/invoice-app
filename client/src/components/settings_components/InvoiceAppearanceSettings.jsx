import React from "react";

const invoiceTemplates = [
  { value: "urban", label: "Urban" },
  { value: "clean", label: "Clean" },
  { value: "iconic", label: "Iconic" },
  { value: "foxy", label: "Foxy" },
  { value: "klaralven", label: "Klarälven" },
  { value: "original", label: "Original" },
  { value: "croatia", label: "Croatia" },
];

export default function InvoiceAppearanceSettings({ selected, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Invoice Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {invoiceTemplates.map((template) => (
          <label
            key={template.value}
            className={`border p-3 rounded cursor-pointer flex items-center space-x-2 hover:bg-gray-50 ${
              selected === template.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="invoiceTemplate"
              value={template.value}
              checked={selected === template.value}
              onChange={() => onChange(template.value)}
            />
            <span>{template.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
