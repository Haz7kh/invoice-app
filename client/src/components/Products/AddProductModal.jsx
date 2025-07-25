import React from "react";
import ProductForm from "./ProductForm";
import { useTranslation } from "react-i18next";

export default function AddProductModal({
  initialName = "",
  onClose,
  onProductCreated,
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-8 min-w-[400px] relative">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          {t("addProductModal.title")}
        </h2>
        <ProductForm
          initialData={{ name: initialName }}
          submitLabel={t("addProductModal.create")}
          onSubmit={async (formData) => {
            try {
              const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              });
              if (!res.ok) throw new Error(t("addProductModal.error"));
              const newProduct = await res.json();
              if (onProductCreated) onProductCreated(newProduct);
              onClose();
            } catch (err) {
              alert("Error: " + err.message);
            }
          }}
          onCancel={onClose}
        />
        <button
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-black"
          onClick={onClose}
          title={t("addProductModal.close")}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
