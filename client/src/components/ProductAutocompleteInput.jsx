import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function ProductAutocompleteInput({
  onSelect,
  onAddNewProductClicked,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query) return;
    fetchProducts(query);
  }, [query]);

  const fetchProducts = debounce(async (text) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products?search=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search failed", err);
    }
  }, 300);

  const handleSelect = async (prod) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${prod._id}`);
      const full = await res.json();
      onSelect(full);
      setQuery(full.name);
      setShowDropdown(false);
    } catch (err) {
      console.error("Product fetch failed", err);
    }
  };

  return (
    <div className="relative w-full flex items-center gap-1">
      <input
        type="text"
        className="p-2 border w-full"
        placeholder="Search product by name or code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      <button
        type="button"
        disabled={!query}
        onClick={() => onAddNewProductClicked(query)}
        className={`border rounded-full p-1 ml-1 ${
          query
            ? "text-green-600 border-green-600 hover:bg-green-100"
            : "text-gray-400 border-gray-200 cursor-not-allowed"
        }`}
        title="Add new product"
        tabIndex={-1}
      >
        <svg width={18} height={18} viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            fill="#fff"
          />
          <path
            d="M10 6v8M6 10h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Product results dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto shadow">
          {results.map((prod) => (
            <li
              key={prod._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(prod)}
            >
              <div className="font-semibold">{prod.name}</div>
              <div className="text-xs text-gray-500">{prod.productCode}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
