const API_BASE_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API Error");
  }

  return res.json();
}

// Get all clients
export async function getClients() {
  return request("/customers");
}

// Create a client
export async function createClient(clientData) {
  return request("/customers", {
    method: "POST",
    body: JSON.stringify(clientData),
  });
}
