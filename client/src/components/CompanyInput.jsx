import React, { useState } from "react";

export default function CompanyInput({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    vatNo: "",
    seat: "",
    fTax: false,
    email: "",
    address: "",
    c_o: "",
    city: "",
    zip: "",
    country: "Sweden",
    phone: "",
    mobile: "",
    website: "",
    fax: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {
      type: "company",
      companyName: form.name,
      orgNumber: form.regNo,
      vatNumber: form.vatNo,
      email: form.email,
      sendBy: ["email"],
      attachPdf: false,
      billingAddress: {
        co: form.c_o,
        address: form.address,
        zip: form.zip,
        city: form.city,
        country: form.country,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create company");
      }

      setSuccess(true);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-xl shadow-md space-y-8"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Company Details
      </h2>

      {/* General Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full border rounded-lg p-2 shadow-sm focus:outline-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company reg. no.
          </label>
          <input
            name="regNo"
            value={form.regNo}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            VAT no.
          </label>
          <input
            name="vatNo"
            value={form.vatNo}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company seat
          </label>
          <input
            name="seat"
            value={form.seat}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            F-tax certificate
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="fTax"
                value={true}
                checked={form.fTax === true}
                onChange={() => setForm({ ...form, fTax: true })}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="fTax"
                value={false}
                checked={form.fTax === false}
                onChange={() => setForm({ ...form, fTax: false })}
              />
              No
            </label>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">
        Billing Address
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">C/O</label>
          <input
            name="c_o"
            value={form.c_o}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Zip Code
          </label>
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          >
            <option>Sweden</option>
            <option>Norway</option>
            <option>Denmark</option>
            <option>Finland</option>
          </select>
        </div>
      </div>

      {/* Contact Info */}
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-1">
        Contact Information
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mobile
          </label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Fax</label>
          <input
            name="fax"
            value={form.fax}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg p-2 shadow-sm"
          />
        </div>
      </div>

      {/* Submit + Feedback */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Save Company
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">
            Company successfully created!
          </p>
        )}
      </div>
    </form>
  );
}
