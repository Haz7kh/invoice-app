const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// import the routes
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const companyRoutes = require("./routes/companyRoutes");

dotenv.config();
connectDB(); // Connect MongoDB

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/companies", companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
