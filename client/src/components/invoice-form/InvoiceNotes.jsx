import React from "react";
import { useTranslation } from "react-i18next";

export default function InvoiceNotes({ notes, handleChange }) {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <label className="block font-medium mb-1">
        {t("invoiceNotes.label")}
      </label>
      <textarea
        name="notes"
        rows="3"
        value={notes}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
