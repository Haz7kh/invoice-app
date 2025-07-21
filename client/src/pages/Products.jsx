import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/api";

export default function Products() {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    productCode: "",
    price: 0,
    tax: 25,
    priceInclTax: 0,
    isGreenTech: false,
  });

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const incl =
      (parseFloat(form.price) || 0) * (1 + (parseFloat(form.tax) || 0) / 100);
    setForm((prev) => ({ ...prev, priceInclTax: incl.toFixed(2) }));
  }, [form.price, form.tax]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, form);
      } else {
        await createProduct(form);
      }
      fetchProducts();
      setForm({
        name: "",
        unit: "",
        productCode: "",
        price: 0,
        tax: 25,
        priceInclTax: 0,
        isGreenTech: false,
      });
      setEditId(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  return (
    <div className="ml-64 p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Products and services</h1>

      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
        {/* Product Info Section */}
        <div className="grid grid-cols-4 gap-4">
          <input
            className="p-2 border col-span-2"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="p-2 border"
            name="unit"
            placeholder="Unit"
            value={form.unit}
            onChange={handleChange}
          />
          <input
            className="p-2 border"
            name="productCode"
            placeholder="Product Code"
            value={form.productCode}
            onChange={handleChange}
          />
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-4 gap-4 items-center">
          <input
            className="p-2 border"
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />
          <input
            className="p-2 border"
            name="tax"
            type="number"
            placeholder="Tax %"
            value={form.tax}
            onChange={handleChange}
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

        <button
          className={`text-white font-semibold px-6 py-2 rounded shadow ${
            editId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
          type="submit"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border font-medium">Product / Service</th>
            <th className="p-2 border font-medium">Product Code</th>
            <th className="p-2 border font-medium">Price/Rate</th>
            <th className="p-2 border font-medium">Unit</th>
            <th className="p-2 border font-medium">VAT %</th>
            <th className="p-2 border font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className="hover:bg-gray-50">
              <td className="p-2 border text-blue-600 cursor-pointer">
                {prod.name}
              </td>
              <td className="p-2 border">{prod.productCode}</td>
              <td className="p-2 border">{prod.price.toFixed(2)}</td>
              <td className="p-2 border">{prod.unit}</td>
              <td className="p-2 border">{prod.tax}%</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(prod)}
                >
                  📝
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(prod._id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
