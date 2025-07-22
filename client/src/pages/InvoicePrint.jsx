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

  const {
    customer,
    invoiceNumber,
    invoiceDate,
    dueDate,
    paymentTerms,
    items,
    netTotal,
    vatTotal,
    grandTotal,
  } = invoice;

  return (
    <div className="bg-gray-100 p-6 print:p-0 print:m-0 print:bg-white print:h-auto print:min-h-0">
      {/* ✅ PRINT BUTTON */}
      <button
        onClick={() => window.print()}
        className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition print:hidden"
      >
        Skriv ut som PDF
      </button>

      {/* ✅ INVOICE CONTENT */}
      <div className="bg-white text-black font-sans text-sm w-full max-w-4xl mx-auto p-10 print:w-full print:max-w-full print:p-0 print:m-0 print:overflow-visible print:h-auto print:min-h-0">
        <h1 className="text-2xl font-bold mb-6">Stocktak AB - FAKTURA</h1>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">Fakturanr:</span> {invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Fakturadatum:</span>{" "}
              {new Date(invoiceDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Förfallodatum:</span>{" "}
              {new Date(dueDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Betalningsvillkor:</span>{" "}
              {paymentTerms} dagar netto
            </p>
          </div>
          <div>
            <p className="font-semibold">Faktureringsadress:</p>
            <p>{customer?.companyName}</p>
            <p>{customer?.address}</p>
            <p>
              {customer?.zip} {customer?.city}
            </p>
          </div>
        </div>

        <table className="w-full border border-gray-400 border-collapse mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">
                Produkt / tjänst
              </th>
              <th className="border border-gray-400 px-4 py-2 text-right">
                Antal
              </th>
              <th className="border border-gray-400 px-4 py-2 text-right">
                À-pris
              </th>
              <th className="border border-gray-400 px-4 py-2 text-right">
                Belopp
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const quantity = Number(item.quantity);
              const price = Number(item.price);
              const isLineItem =
                !isNaN(quantity) && !isNaN(price) && quantity > 0 && price > 0;

              if (isLineItem) {
                const total = quantity * price;
                return (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.product || item.text}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {quantity.toFixed(2)} {item.unit || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {price.toFixed(2)} kr
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {total.toFixed(2)} kr
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={idx}>
                    <td
                      colSpan={4}
                      className="border border-gray-300 px-4 py-2 italic text-gray-700"
                    >
                      {item.text || "Kommentar / Beskrivning"}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="font-semibold">Netto:</span>
              <span>{netTotal.toFixed(2)} kr</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold">Moms 25%:</span>
              <span>{vatTotal.toFixed(2)} kr</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold">Öresutjämning:</span>
              <span>0,00 kr</span>
            </div>
            <div className="flex justify-between py-1 font-bold border-t border-gray-300 mt-2 pt-2">
              <span>Summa att betala:</span>
              <span>{grandTotal.toFixed(2)} kr</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <p>Godkänd för F-skatt</p>
          <p className="mt-2">
            Denna faktura skickades via Fakturan.nu.
            <br />
            Enkel och gratis fakturering direkt från webben.
          </p>
          <a
            className="text-blue-600 underline"
            href="https://www.fakturan.nu/?ref=invoice"
          >
            https://www.fakturan.nu/?ref=invoice
          </a>
        </div>
      </div>
    </div>
  );
}
