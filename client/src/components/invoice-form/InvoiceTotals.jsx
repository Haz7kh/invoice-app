import React from "react";

export default function InvoiceTotals({
  netTotal,
  vatTotal,
  grandTotal,
  currency,
}) {
  return (
    <div className="flex justify-end mt-4">
      <div className="text-right space-y-1">
        <div>
          <strong>Net:</strong> {netTotal} {currency}
        </div>
        <div>
          <strong>VAT:</strong> {vatTotal} {currency}
        </div>
        <div>
          <strong>Total:</strong> {grandTotal} {currency}
        </div>
      </div>
    </div>
  );
}
