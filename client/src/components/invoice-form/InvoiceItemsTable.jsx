import React, { useState } from "react";
import ProductAutocompleteInput from "../ProductAutocompleteInput";
import AddProductModal from "../Products/AddProductModal";

export default function InvoiceItemsTable({
  items,
  setInvoice,
  invoice,
  addNewItem,
}) {
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
            <th className="p-2 border">Product / Service</th>
            <th className="p-2 border">Text</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Unit</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">VAT%</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Net</th>
            <th className="p-2 border">❌</th>
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
                      placeholder="Add a description or note (optional)"
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

            // ...your old product/service row code below!
            const qty = parseFloat(item.quantity || 0);
            const price = parseFloat(item.price || 0);
            const disc = item.discountPercent || 0;
            const netLine = (price * qty * (1 - disc / 100)).toFixed(2);

            return (
              <tr key={i}>
                {/* ...the product/service row code as before */}
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
                    placeholder="Extra info"
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
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + New Product row
        </button>

        <button
          onClick={addNewTextRow}
          className="px-4 py-2 bg-white border rounded ml-2"
        >
          + New text row
        </button>
      </div>

      {/* Modal rendered outside the table */}
      {showProductModal && (
        <AddProductModal
          initialName={productInitialName}
          onClose={() => setShowProductModal(false)}
          onProductCreated={(newProduct) => {
            // Update only the correct item row
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
