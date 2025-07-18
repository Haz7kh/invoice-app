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

export async function getCurrentUserData() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();
    return data; // Expecting { name, company, ... }
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getCompany() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:3000/api/companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 404) return null; // ✅ no company yet, not a real error
    if (!res.ok) throw new Error("Failed to fetch company");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Company fetch error:", error);
    return null;
  }
}
