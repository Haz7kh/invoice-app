import React from "react";
import { useTranslation } from "react-i18next";

export default function InvoiceTotals({
  netTotal,
  vatTotal,
  grandTotal,
  currency,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mt-4">
      <div className="text-right space-y-1">
        <div>
          <strong>{t("invoiceTotals.net")}</strong> {netTotal} {currency}
        </div>
        <div>
          <strong>{t("invoiceTotals.vat")}</strong> {vatTotal} {currency}
        </div>
        <div>
          <strong>{t("invoiceTotals.total")}</strong> {grandTotal} {currency}
        </div>
      </div>
    </div>
  );
}
