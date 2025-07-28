import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../services/api";
import { useTranslation } from "react-i18next";

export default function InvoicePrint() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        console.error("Failed to load invoice:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading || !invoice) return <div>Loading...</div>;

  const {
    customer,
    companyFrom,
    invoiceNumber,
    invoiceDate,
    dueDate,
    items,
    netTotal,
    vatTotal,
    grandTotal,
  } = invoice;

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-10 print:bg-white">
      <div className="bg-white shadow-md rounded-md w-full max-w-4xl p-10 print:p-0 print:shadow-none print:rounded-none text-black font-sans text-sm">
        {/* PRINT BUTTON */}
        <button
          onClick={() => window.print()}
          className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition print:hidden"
        >
          {t("invoice.print_button")}
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {companyFrom?.companyName || "SY Group AB"}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{t("invoice.title")}</p>
            <p>
              {t("invoice.number")} {invoiceNumber || "130461"}
            </p>
          </div>
        </div>

        {/* CUSTOMER BOX */}
        <div className="flex justify-end mb-8">
          <div className="border border-gray-400 p-4 w-80 rounded">
            <p className="font-semibold text-gray-700">
              {customer?.companyName || "Kundens namn AB"}
            </p>
            <p>{customer?.billingAddress?.address || "Exempelgatan 1"}</p>
            <p>
              {customer?.billingAddress?.zip || "12345"}{" "}
              {customer?.billingAddress?.city || "Stad"}
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-1">
            <p>
              <strong>{t("invoice.date")}:</strong>{" "}
              {invoiceDate
                ? new Date(invoiceDate).toISOString().split("T")[0]
                : "-"}
            </p>
            <p>
              <strong>{t("invoice.delivery_date")}:</strong>{" "}
              {invoiceDate
                ? new Date(invoiceDate).toISOString().split("T")[0]
                : "-"}
            </p>
            <p>
              <strong>{t("invoice.due_date")}:</strong>{" "}
              {dueDate ? new Date(dueDate).toISOString().split("T")[0] : "-"}
            </p>
            <p>
              <strong>{t("invoice.your_ref")}:</strong>{" "}
              {invoice.yourReference || "-"}
            </p>
            <p>
              <strong>{t("invoice.our_ref")}:</strong>{" "}
              {invoice.ourReference || "-"}
            </p>
            <p>
              <strong>{t("invoice.late_fee")}:</strong>
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border border-black border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["code", "desc", "qty", "unit", "price", "total"].map(
                  (key, index) => (
                    <th
                      key={index}
                      className="px-3 py-2 text-left font-semibold border border-black"
                    >
                      {t(`invoice.items.${key}`)}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const quantity = Number(item.quantity || 0);
                const price = Number(item.price || 0);
                const total = quantity * price;
                const isTextNote = item.type === "text";

                if (isTextNote) {
                  return (
                    <tr key={i} className="border-t border-black bg-gray-50">
                      <td
                        colSpan={6}
                        className="px-3 py-2 italic text-gray-600"
                      >
                        {item.text}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={i} className="border-t border-black">
                    <td className="px-3 py-2 border-r border-black">
                      {item.productCode || "-"}
                    </td>
                    <td className="px-3 py-2 border-r border-black">
                      {item.product || ""}
                    </td>
                    <td className="px-3 py-2 text-right border-r border-black">
                      {quantity.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right border-r border-black">
                      {item.unit || "st"}
                    </td>
                    <td className="px-3 py-2 text-right border-r border-black">
                      {price.toLocaleString("sv-SE")}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {total.toLocaleString("sv-SE")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="flex justify-end mb-8">
          <div className="text-sm w-64 space-y-1">
            <div className="flex justify-between border-t py-1">
              <span>{t("invoice.totals.subtotal")}</span>
              <span>{netTotal.toLocaleString("sv-SE")} kr</span>
            </div>
            <div className="flex justify-between py-1">
              <span>
                {t("invoice.totals.vat")} ({items[0]?.vatPercent || 0} %):
              </span>
              <span>{vatTotal.toFixed(2)} kr</span>
            </div>
            <div className="flex justify-between font-bold py-2 border-t mt-2 text-base">
              <span>{t("invoice.totals.grand")}</span>
              <span>{grandTotal.toLocaleString("sv-SE")} kr</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-6 border-t border-gray-300 grid grid-cols-3 gap-4 text-xs text-gray-700">
          <div>
            <p className="font-semibold">{t("invoice.footer.address")}</p>
            <p>{companyFrom?.companyName || "SY Group AB"}</p>
            <p>{companyFrom?.billingAddress?.address || "Gata 123"}</p>
            <p>
              {companyFrom?.billingAddress?.zip || "00000"}{" "}
              {companyFrom?.billingAddress?.city || "Stad"}
            </p>
          </div>
          <div>
            <p className="font-semibold">{t("invoice.footer.email")}</p>
            <p>{companyFrom?.email || "info@example.com"}</p>
          </div>
          <div>
            <p className="font-semibold">{t("invoice.footer.org_number")}</p>
            <p>{companyFrom?.orgNumber || "559340-2679"}</p>
            <p>{t("invoice.footer.f_tax")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
