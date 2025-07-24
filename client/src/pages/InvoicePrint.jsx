import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../services/api";

export default function InvoicePrint() {
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

  // Dummy content until we bind real data
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

  console.log(invoice.items);

  return (
    <div className="bg-white text-black p-10 print:p-0 font-sans text-sm">
      {/* PRINT BUTTON */}
      <button
        onClick={() => window.print()}
        className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition print:hidden"
      >
        Skriv ut som PDF
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold">
            {companyFrom?.companyName || "SY Group AB"}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Faktura</p>
          <p>Fakturanummer {invoiceNumber || "130461"}</p>
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
            <strong>Fakturadatum</strong>{" "}
            {new Date(invoiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Leveransdatum</strong>{" "}
            {new Date(invoiceDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Förfallodatum</strong>{" "}
            {new Date(dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Er referens</strong> {invoice.yourReference || "-"}
          </p>
          <p>
            <strong>Vår referens</strong> {invoice.ourReference || "-"}
          </p>

          <p>
            <strong>Dröjsmålsränta</strong> Vid betalning efter förfallodagen
            debiteras ränta enligt räntelagen.
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <table className="w-full border border-black border-collapse mb-6 text-sm">
        <thead className="border-b border-black">
          <tr>
            <th className="px-2 py-1 text-left font-semibold border-r border-black">
              Art.nr
            </th>
            <th className="px-2 py-1 text-left font-semibold border-r border-black">
              Beskrivning
            </th>
            <th className="px-2 py-1 text-right font-semibold border-r border-black">
              Antal
            </th>
            <th className="px-2 py-1 text-right font-semibold border-r border-black">
              Enhet
            </th>
            <th className="px-2 py-1 text-right font-semibold border-r border-black">
              À-pris
            </th>
            <th className="px-2 py-1 text-right font-semibold">Summa</th>{" "}
            {/* Last one: no right border */}
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
                <tr key={i}>
                  <td colSpan={6} className="px-2 py-1 italic text-gray-700">
                    {item.text}
                  </td>
                </tr>
              );
            }

            return (
              <tr key={i}>
                <td className="px-2 py-1">{item.productCode || "-"}</td>
                <td className="px-2 py-1">{item.product || ""}</td>
                <td className="px-2 py-1 text-right">{quantity.toFixed(2)}</td>
                <td className="px-2 py-1 text-right">{item.unit || "st"}</td>
                <td className="px-2 py-1 text-right">
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
            <span>Exkl. moms</span>
            <span>{netTotal.toLocaleString("sv-SE")} kr</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-semibold">
              Moms ({items[0]?.vatPercent || 0} %):
            </span>
            <span>{vatTotal.toFixed(2)} kr</span>
          </div>

          <div className="flex justify-between font-bold py-1 border-t mt-2">
            <span>Att betala</span>
            <span>{grandTotal.toLocaleString("sv-SE")} kr</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="grid grid-cols-3 gap-4 text-xs mt-6">
        <div>
          <p>
            <strong>Adress</strong>
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
            <strong>E-post</strong>
          </p>
          <p>{companyFrom?.email || "info@example.com"}</p>
        </div>
        <div>
          <p>
            <strong>Organisationsnr</strong>
          </p>
          <p>{companyFrom?.orgNumber || "559340-2679"}</p>
          <p>Godkänd för F-skatt</p>
        </div>
      </div>
    </div>
  );
}
