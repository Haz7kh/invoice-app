import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProductForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Add Product",
}) {
  const { t } = useTranslation();

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
          placeholder={t("productForm.placeholders.name")}
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="unit"
          placeholder={t("productForm.placeholders.unit")}
          value={form.unit}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="productCode"
          placeholder={t("productForm.placeholders.product_code")}
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
          placeholder={t("productForm.placeholders.price")}
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="p-2 border"
          name="tax"
          type="number"
          placeholder={t("productForm.placeholders.tax")}
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
          {t("productForm.labels.green_tech")}
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
            {t("productForm.buttons.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
