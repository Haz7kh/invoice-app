import React from "react";
import { useTranslation } from "react-i18next";

export default function InvoiceFormButtons({
  isSubmitting,
  handleSubmit,
  onCancel,
}) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 flex gap-4">
      <button
        className={`${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } bg-green-600 text-white px-6 py-2 rounded`}
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting
          ? t("invoiceFormButtons.saving")
          : t("invoiceFormButtons.create")}
      </button>
      <button
        className="px-6 py-2 border cursor-pointer rounded"
        onClick={onCancel}
      >
        {t("invoiceFormButtons.cancel")}
      </button>
    </div>
  );
}
