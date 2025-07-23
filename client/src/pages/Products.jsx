import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/api";
import ProductForm from "../components/Products/ProductForm";
import { FaTrash, FaEdit } from "react-icons/fa";

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
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

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
    <div className="ml-64 p-6 max-w-7xl bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Products & Services</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-10">
        <ProductForm
          initialData={editId ? editData : emptyForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={editId ? "Update Product" : "Add Product"}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <table className="w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Product / Service</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-left">VAT %</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400 italic">
                  No products available.
                </td>
              </tr>
            ) : (
              products.map((prod) => (
                <tr
                  key={prod._id}
                  className="hover:bg-gray-50 border-t transition-all duration-150"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">{prod.name}</td>
                  <td className="px-4 py-3">{prod.productCode}</td>
                  <td className="px-4 py-3">{prod.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{prod.unit}</td>
                  <td className="px-4 py-3">{prod.tax}%</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(prod)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(prod._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
