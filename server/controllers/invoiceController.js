const Invoice = require("../models/Invoice");

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
  try {
    const {
      customer,
      invoiceNumber,
      invoiceDate,
      paymentTerms,
      dueDate,
      yourReference,
      ourReference,
      language,
      currency,
      items,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Invoice must include items" });
    }

    // Calculate net, VAT, and grand totals
    let netTotal = 0;
    let vatTotal = 0;

    items.forEach((item) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const discount = item.discountPercent || 0;
      const vat = item.vatPercent || 0;

      const discountedPrice = qty * price * (1 - discount / 100);
      const vatAmount = discountedPrice * (vat / 100);

      netTotal += discountedPrice;
      vatTotal += vatAmount;
    });

    const grandTotal = netTotal + vatTotal;

    const invoice = await Invoice.create({
      user: req.user._id,
      customer,
      invoiceNumber,
      invoiceDate,
      paymentTerms,
      dueDate,
      yourReference,
      ourReference,
      language,
      currency,
      items,
      netTotal,
      vatTotal,
      grandTotal,
      notes,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Create Invoice Error:", error);
    res.status(500).json({ message: "Failed to create invoice" });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate("customer", "companyName email")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  // Check ownership
  if (invoice.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  if (invoice.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await invoice.deleteOne();

  res.status(200).json({ message: "Invoice deleted" });
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
};
