import React, { useEffect, useState } from "react";

export default function ProductForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Add Product",
}) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    productCode: "",
    price: 0,
    tax: 25,
    priceInclTax: 0,
    isGreenTech: false,
    ...initialData,
  });

  useEffect(() => {
    const incl =
      (parseFloat(form.price) || 0) * (1 + (parseFloat(form.tax) || 0) / 100);
    setForm((prev) => ({ ...prev, priceInclTax: incl.toFixed(2) }));
    // eslint-disable-next-line
  }, [form.price, form.tax]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <input
          className="p-2 border col-span-2"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="productCode"
          placeholder="Product Code"
          value={form.productCode}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-4 gap-4 items-center">
        <input
          className="p-2 border"
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="tax"
          type="number"
          placeholder="Tax %"
          value={form.tax}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border bg-gray-100"
          name="priceInclTax"
          value={form.priceInclTax}
          readOnly
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isGreenTech"
            checked={form.isGreenTech}
            onChange={handleChange}
          />
          ROT / RUT / Green Tech
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
