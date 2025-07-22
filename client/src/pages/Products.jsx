import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/api";
import ProductForm from "../components/Products/ProductForm";

export default function Products() {
  const emptyForm = {
    name: "",
    unit: "",
    productCode: "",
    price: 0,
    tax: 25,
    priceInclTax: 0,
    isGreenTech: false,
  };

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(emptyForm);

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

  const handleEdit = (product) => {
    setEditData(product);
    setEditId(product._id);
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

  // When submitting, delegate all form logic to ProductForm, only manage list here
  const handleSubmit = async (data) => {
    try {
      if (editId) {
        await updateProduct(editId, data);
      } else {
        await createProduct(data);
      }
      fetchProducts();
      setEditData(emptyForm);
      setEditId(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleCancel = () => {
    setEditData(emptyForm);
    setEditId(null);
  };

  return (
    <div className="ml-64 p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Products and services</h1>

      <ProductForm
        initialData={editId ? editData : emptyForm}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={editId ? "Update Product" : "Add Product"}
      />

      {/* Table */}
      <table className="w-full text-left border-collapse mt-10">
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
                  title="Edit"
                >
                  📝
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(prod._id)}
                  title="Delete"
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
