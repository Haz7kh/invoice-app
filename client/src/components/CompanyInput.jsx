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
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = {
      type: "company", // required
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-green-700">Company settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Company name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Company reg. no.</label>
          <input
            name="regNo"
            value={form.regNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Vat no.</label>
          <input
            name="vatNo"
            value={form.vatNo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Company seat</label>
          <input
            name="seat"
            value={form.seat}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-1">
            Does your company hold an F-tax certificate?
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="fTax"
                value={true}
                checked={form.fTax === true}
                onChange={() => setForm({ ...form, fTax: true })}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
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

      <h2 className="text-xl font-semibold text-green-700">Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>C/O</label>
          <input
            name="c_o"
            value={form.c_o}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Zip Code</label>
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="col-span-2">
          <label>Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Sweden</option>
            <option>Norway</option>
            <option>Denmark</option>
            <option>Finland</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-green-700">
        Contact Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Company email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Website</label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label>Fax</label>
          <input
            name="fax"
            value={form.fax}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Company
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && (
        <p className="text-green-600">Company successfully created!</p>
      )}
    </form>
  );
}
