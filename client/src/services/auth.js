import { jwtDecode } from "jwt-decode";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded; // Contains name, email, etc.

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
}
