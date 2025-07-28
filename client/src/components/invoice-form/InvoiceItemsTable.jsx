import React, { useState } from "react";
import ProductAutocompleteInput from "../ProductAutocompleteInput";
import AddProductModal from "../Products/AddProductModal";
import { useTranslation } from "react-i18next";

export default function InvoiceItemsTable({
  items,
  setInvoice,
  invoice,
  addNewItem,
}) {
  const { t } = useTranslation();
  const [showProductModal, setShowProductModal] = useState(false);
  const [productInitialName, setProductInitialName] = useState("");
  const [productRowIndex, setProductRowIndex] = useState(null);

  function addNewTextRow() {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { type: "text", text: "", id: Date.now() }, // id for key
      ],
    });
  }

  return (
    <div className="mt-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.product")}
            </th>
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.text")}
            </th>
            <th className="p-2 border">{t("invoiceItemsTable.headers.qty")}</th>
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.unit")}
            </th>
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.price")}
            </th>
            <th className="p-2 border">{t("invoiceItemsTable.headers.vat")}</th>
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.discount")}
            </th>
            <th className="p-2 border">{t("invoiceItemsTable.headers.net")}</th>
            <th className="p-2 border">
              {t("invoiceItemsTable.headers.remove")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            if (item.type === "text") {
              return (
                <tr key={item.id || i}>
                  <td className="p-2 border" colSpan={8}>
                    <textarea
                      className="w-full border rounded p-2"
                      placeholder={t("invoiceItemsTable.placeholders.text_row")}
                      value={item.text}
                      maxLength={255}
                      rows={3}
                      onChange={(e) => {
                        const u = [...items];
                        u[i].text = e.target.value;
                        setInvoice({ ...invoice, items: u });
                      }}
                    />
                    <span className="text-gray-400 text-xs float-right">
                      {item.text?.length || 0}/255
                    </span>
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const u = [...items];
                        u.splice(i, 1);
                        setInvoice({ ...invoice, items: u });
                      }}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              );
            }

            const qty = parseFloat(item.quantity || 0);
            const price = parseFloat(item.price || 0);
            const disc = item.discountPercent || 0;
            const netLine = (price * qty * (1 - disc / 100)).toFixed(2);

            return (
              <tr key={i}>
                <td className="p-2 border">
                  <ProductAutocompleteInput
                    onSelect={(prod) => {
                      const updated = [...items];
                      updated[i] = {
                        ...updated[i],
                        productId: prod._id,
                        product: prod.name,
                        unit: prod.unit,
                        price: prod.price,
                        vatPercent: prod.tax,
                      };
                      setInvoice({ ...invoice, items: updated });
                    }}
                    onAddNewProductClicked={(query) => {
                      setProductInitialName(query);
                      setProductRowIndex(i);
                      setShowProductModal(true);
                    }}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.text || ""}
                    onChange={(e) => {
                      const u = [...items];
                      u[i].text = e.target.value;
                      setInvoice({ ...invoice, items: u });
                    }}
                    className="w-full border p-1"
                    placeholder={t("invoiceItemsTable.placeholders.extra_info")}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const u = [...items];
                      u[i].quantity = parseFloat(e.target.value) || 0;
                      setInvoice({ ...invoice, items: u });
                    }}
                    className="w-16 border p-1"
                  />
                </td>
                <td className="p-2 border">{item.unit}</td>
                <td className="p-2 border">{item.price}</td>
                <td className="p-2 border">{item.vatPercent}%</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.discountPercent}
                    onChange={(e) => {
                      const u = [...items];
                      u[i].discountPercent = parseFloat(e.target.value) || 0;
                      setInvoice({ ...invoice, items: u });
                    }}
                    className="w-16 border p-1"
                  />
                </td>
                <td className="p-2 border">{netLine}</td>
                <td className="p-2 border text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const u = [...items];
                      u.splice(i, 1);
                      setInvoice({ ...invoice, items: u });
                    }}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex gap-3 mt-4">
        <button
          onClick={addNewItem}
          className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
        >
          {t("invoiceItemsTable.buttons.add_product")}
        </button>

        <button
          onClick={addNewTextRow}
          className="px-4 py-2 bg-white border cursor-pointer rounded ml-2"
        >
          {t("invoiceItemsTable.buttons.add_text")}
        </button>
      </div>

      {showProductModal && (
        <AddProductModal
          initialName={productInitialName}
          onClose={() => setShowProductModal(false)}
          onProductCreated={(newProduct) => {
            const updated = [...items];
            updated[productRowIndex] = {
              ...updated[productRowIndex],
              productId: newProduct._id,
              product: newProduct.name,
              unit: newProduct.unit,
              price: newProduct.price,
              vatPercent: newProduct.tax,
            };
            setInvoice({ ...invoice, items: updated });
            setShowProductModal(false);
          }}
        />
      )}
    </div>
  );
}
