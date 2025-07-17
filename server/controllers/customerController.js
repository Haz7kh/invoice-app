// server/controllers/customerController.js
const Customer = require("../models/Customer");

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
  const {
    type,
    companyName,
    orgNumber,
    vatNumber,
    email,
    sendBy,
    attachPdf,
    billingAddress,
  } = req.body;

  if (!type) {
    return res.status(400).json({ message: "Customer type is required" });
  }

  const customer = await Customer.create({
    type,
    companyName,
    orgNumber,
    vatNumber,
    email,
    sendBy,
    attachPdf,
    billingAddress,
    user: req.user._id, // comes from authMiddleware
  });

  res.status(201).json(customer);
};

// @desc    Get all customers for the user
// @route   GET /api/customers
// @access  Private
// Get all customers for the logged-in user
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// @desc    Update a customer by ID
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Check if user owns this customer
  if (customer.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
};

// @desc    Delete a customer by ID
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  if (customer.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await customer.deleteOne();

  res.status(200).json({ message: "Customer deleted" });
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
