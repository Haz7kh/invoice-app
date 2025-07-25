import React, { useEffect, useState } from "react";
import { getClients, createClient } from "../services/api";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Clients() {
  const { t } = useTranslation();

  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "",
    companyName: "",
    orgNumber: "",
    vatNumber: "",
    email: "",
    sendBy: "",
    attachPdf: false,
    billingAddress: {
      co: "",
      address: "",
      zipCode: "",
      city: "",
      country: "sweden",
    },
  });

  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return t("clients.time.today");
    if (diff === 1) return t("clients.time.one_day");
    return t("clients.time.days_ago", { count: diff });
  };

  useEffect(() => {
    getClients()
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load clients");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("billingAddress.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const newC = await createClient(formData);
      setClients((prev) => [newC, ...prev]);
      setNewClient(false);
      setFormData({
        type: "",
        companyName: "",
        orgNumber: "",
        vatNumber: "",
        email: "",
        sendBy: "",
        attachPdf: false,
        billingAddress: {
          co: "",
          address: "",
          zipCode: "",
          city: "",
          country: "sweden",
        },
      });
    } catch (err) {
      alert("Failed to create client: " + err.message);
    }
  };

  const handleCancel = () => {
    setNewClient(false);
  };

  if (loading) return <div className="p-6">{t("loading")}</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="ml-64">
      <div>
        <div className="py-4 px-6 bg-gray-200 shadow-sm">
          <h2 className="text-gray-700 text-3xl font-bold">
            {t("clients.title")}
          </h2>
        </div>
        <div className="flex flex-wrap gap-4 justify-around my-6 px-4">
          <div className="flex">
            <button
              onClick={() => setNewClient(!newClient)}
              className="cursor-pointer flex items-center gap-2 bg-green-400 px-4 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              <FaUserPlus className="text-white" size={18} />
              <h3 className="text-white text-sm font-medium">
                {t("clients.new")}
              </h3>
            </button>
            <button className="cursor-pointer mx-5 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
              <h3>{t("clients.print")}</h3>
            </button>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("clients.search")}
              className="pl-10 pr-4 py-2 rounded-full bg-white shadow border outline-none w-64 max-w-full"
            />
          </div>
        </div>
      </div>

      {!newClient ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{t("clients.title")}</h1>
          {clients.length === 0 ? (
            <p>{t("clients.empty")}</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.id")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.name")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.city")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.updated")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.email")}
                  </th>
                  <th className="py-2 px-4 text-left">
                    {t("clients.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client._id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4 text-blue-600 font-medium underline cursor-pointer">
                      {client.companyName}
                    </td>
                    <td className="py-2 px-4">{client.billingAddress?.city}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {timeAgo(client.updatedAt)}
                    </td>
                    <td className="py-2 px-4">
                      <a
                        href={`mailto:${client.email}`}
                        className="text-sky-600 hover:underline"
                      >
                        {client.email}
                      </a>
                    </td>
                    <td className="py-2 px-4">
                      <button className="text-gray-500 hover:text-gray-800">
                        ⚙️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {t("clients.form.general")}
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="company"
                    checked={formData.type === "company"}
                    onChange={handleChange}
                  />
                  <span>{t("clients.form.company")}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="person"
                    checked={formData.type === "person"}
                    onChange={handleChange}
                  />
                  <span>{t("clients.form.person")}</span>
                </label>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                {t("clients.form.company_name")}
              </label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="bg-white w-full h-9 rounded px-3 mb-3"
                type="text"
              />
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t("clients.form.reg_no")}
                  </label>
                  <input
                    name="orgNumber"
                    value={formData.orgNumber}
                    onChange={handleChange}
                    className="bg-white w-full h-9 rounded px-3 mb-3"
                    type="text"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t("clients.form.vat_no")}
                  </label>
                  <input
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleChange}
                    className="bg-white w-full h-9 rounded px-3 mb-3"
                    type="text"
                  />
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                {t("clients.form.email")}
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white w-full h-9 rounded px-3 mb-3"
                type="email"
              />
              <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">
                {t("clients.form.send_by")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  {
                    label: t("clients.form.send_options.email"),
                    value: "email",
                  },
                  {
                    label: t("clients.form.send_options.email_sms"),
                    value: "e-post_sms",
                  },
                  {
                    label: t("clients.form.send_options.letter"),
                    value: "letter",
                  },
                  {
                    label: t("clients.form.send_options.e_invoice"),
                    value: "e-invoice",
                  },
                ].map(({ label, value }, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sendBy"
                      value={value}
                      checked={formData.sendBy === value}
                      onChange={handleChange}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  name="attachPdf"
                  checked={formData.attachPdf}
                  onChange={handleChange}
                />
                <span>{t("clients.form.attach_pdf")}</span>
              </label>
            </div>

            <div>
              <div className="flex gap-6 mb-4">
                <div>
                  <button className="cursor-pointer text-center font-semibold text-green-600">
                    {t("clients.form.billing")}
                  </button>
                  <div className="h-0.5 bg-green-500 w-full mt-1"></div>
                </div>
                <button className="cursor-pointer text-center font-semibold text-gray-500">
                  {t("clients.form.delivery")}
                </button>
              </div>
              <label className="block text-sm font-semibold text-gray-700 md:mt-12">
                {t("clients.form.co")}
              </label>
              <input
                name="billingAddress.co"
                value={formData.billingAddress.co}
                onChange={handleChange}
                className="bg-white w-full h-9 rounded px-3 mb-3"
                type="text"
              />
              <label className="block text-sm font-semibold text-gray-700">
                {t("clients.form.address")}
              </label>
              <input
                name="billingAddress.address"
                value={formData.billingAddress.address}
                onChange={handleChange}
                className="bg-white w-full h-9 rounded px-3 mb-3"
                type="text"
              />
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t("clients.form.zip")}
                  </label>
                  <input
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleChange}
                    className="bg-white w-full h-9 rounded px-3 mb-3"
                    type="text"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t("clients.form.city")}
                  </label>
                  <input
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    className="bg-white w-full h-9 rounded px-3 mb-3"
                    type="text"
                  />
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                {t("clients.form.country")}
              </label>
              <select
                name="billingAddress.country"
                value={formData.billingAddress.country}
                onChange={handleChange}
                className="bg-white w-full h-9 rounded px-3 mb-3 border border-gray-300 outline-none"
              >
                <option value="sweden">Sweden</option>
                <option value="norway">Norway</option>
                <option value="denmark">Denmark</option>
              </select>
            </div>
          </div>

          <div className="my-6 border-t border-gray-300" />
          <h2 className="text-center text-sm font-semibold text-gray-600 mb-2 cursor-pointer hover:text-green-600 transition">
            {t("clients.form.details")}
          </h2>
          <div className="border-t border-gray-300 mb-6" />

          <div className="flex justify-start gap-4">
            <button
              onClick={handleSubmit}
              className="cursor-pointer bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              {t("clients.form.create")}
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              {t("clients.form.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
