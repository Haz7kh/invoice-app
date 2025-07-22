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

export async function getCompanies() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await fetch("http://localhost:3000/api/companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch companies");

    const data = await res.json();
    return data; // ✅ this is now an array of companies
  } catch (error) {
    console.error("Company fetch error:", error);
    return [];
  }
}

export async function saveCompany(companyData) {
  return request("/companies", {
    method: "POST",
    body: JSON.stringify(companyData),
  });
}
export async function updateCompany(id, updatedData) {
  return request(`/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
}

// invoice create :
export async function createInvoice(invoiceData) {
  return request("/invoices", {
    method: "POST",
    body: JSON.stringify(invoiceData),
  });
}

export async function getInvoices() {
  return request("/invoices");
}

// services/api.js

export const getInvoiceById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/api/invoices/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch invoice");
  }

  return res.json();
};

// CREATE product
export async function createProduct(productData) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

// GET all products
export async function getProducts() {
  return request("/products");
}

// DELETE a product by ID
export async function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
}

// UPDATE a product by ID
export async function updateProduct(productId, updatedData) {
  return request(`/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
}
