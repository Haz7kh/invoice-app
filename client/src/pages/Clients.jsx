import React, { useEffect, useState } from "react";
import { getClients } from "../services/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <ul className="list-disc list-inside">
          {clients.map((c) => (
            <li key={c._id}>{c.companyName || c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
