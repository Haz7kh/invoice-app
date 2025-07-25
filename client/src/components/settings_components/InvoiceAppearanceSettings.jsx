import React from "react";
import { useTranslation } from "react-i18next";

const invoiceTemplates = [
  "urban",
  "clean",
  "iconic",
  "foxy",
  "klaralven",
  "original",
  "croatia",
];

export default function InvoiceAppearanceSettings({ selected, onChange }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        {t("invoiceAppearance.title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {invoiceTemplates.map((template) => (
          <label
            key={template}
            className={`border p-3 rounded cursor-pointer flex items-center space-x-2 hover:bg-gray-50 ${
              selected === template
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="invoiceTemplate"
              value={template}
              checked={selected === template}
              onChange={() => onChange(template)}
            />
            <span>{t(`invoiceAppearance.templates.${template}`)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
