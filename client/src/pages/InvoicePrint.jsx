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
    <div className="flex flex-col min-h-screen bg-white text-black p-10 print:p-0 font-sans text-sm">
      {/* PRINT BUTTON */}
      <button
        onClick={() => window.print()}
        className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition print:hidden"
      >
        {t("invoice.print_button")}
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold">
            {companyFrom?.companyName || "SY Group AB"}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{t("invoice.title")}</p>
          <p>
            {t("invoice.number")} {invoiceNumber || "130461"}
          </p>
        </div>
      </div>

      {/* CUSTOMER BOX */}
      <div className="flex justify-end mb-6">
        <div className="border border-gray-600 p-2 mb-6 w-80">
          <p className="text-sm font-semibold">
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
      <div className="grid grid-cols-2 gap-8 text-sm mb-6">
        <div>
          <p>
            <strong>{t("invoice.date")}</strong>{" "}
            {new Date(invoiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>{t("invoice.delivery_date")}</strong>{" "}
            {new Date(invoiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>{t("invoice.due_date")}</strong>{" "}
            {new Date(dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>{t("invoice.your_ref")}</strong>{" "}
            {invoice.yourReference || "-"}
          </p>
          <p>
            <strong>{t("invoice.our_ref")}</strong>{" "}
            {invoice.ourReference || "-"}
          </p>
          <p>
            <strong>{t("invoice.late_fee")}</strong>
          </p>
        </div>
      </div>

      {/* CONTENT SECTION THAT GROWS */}
      <div className="flex-grow">
        {/* ITEMS TABLE */}
        <table className="w-full border border-black border-collapse mb-6 text-sm">
          <thead className="border-b border-black">
            <tr>
              <th className="px-2 py-1 text-left font-semibold border-r border-black">
                {t("invoice.items.code")}
              </th>
              <th className="px-2 py-1 text-left font-semibold border-r border-black">
                {t("invoice.items.desc")}
              </th>
              <th className="px-2 py-1 text-right font-semibold border-r border-black">
                {t("invoice.items.qty")}
              </th>
              <th className="px-2 py-1 text-right font-semibold border-r border-black">
                {t("invoice.items.unit")}
              </th>
              <th className="px-2 py-1 text-right font-semibold border-r border-black">
                {t("invoice.items.price")}
              </th>
              <th className="px-2 py-1 text-right font-semibold">
                {t("invoice.items.total")}
              </th>
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
                    <td colSpan={6} className="px-2 py-2 italic text-gray-700">
                      {item.text}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={i} className="border-t border-black">
                  <td className="px-2 py-1 border-r border-black">
                    {item.productCode || "-"}
                  </td>
                  <td className="px-2 py-1 border-r border-black">
                    {item.product || ""}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-black">
                    {quantity.toFixed(2)}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-black">
                    {item.unit || "st"}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-black">
                    {price.toLocaleString("sv-SE")}
                  </td>
                  <td className="px-2 py-1 text-right">
                    {total.toLocaleString("sv-SE")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end">
          <div className="text-sm w-64">
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

            <div className="flex justify-between font-bold py-1 border-t mt-2">
              <span>{t("invoice.totals.grand")}</span>
              <span>{grandTotal.toLocaleString("sv-SE")} kr</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER (sticky at bottom) */}
      <div className="mt-auto pt-6 border-t border-gray-300 grid grid-cols-3 gap-4 text-xs">
        <div>
          <p>
            <strong>{t("invoice.footer.address")}</strong>
          </p>
          <p>{companyFrom?.companyName || "SY Group AB"}</p>
          <p>{companyFrom?.billingAddress?.address || "Gata 123"}</p>
          <p>
            {companyFrom?.billingAddress?.zip || "00000"}{" "}
            {companyFrom?.billingAddress?.city || "Stad"}
          </p>
        </div>

        <div>
          <p>
            <strong>{t("invoice.footer.email")}</strong>
          </p>
          <p>{companyFrom?.email || "info@example.com"}</p>
        </div>
        <div>
          <p>
            <strong>{t("invoice.footer.org_number")}</strong>
          </p>
          <p>{companyFrom?.orgNumber || "559340-2679"}</p>
          <p>{t("invoice.footer.f_tax")}</p>
        </div>
      </div>
    </div>
  );
}
