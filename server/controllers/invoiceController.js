const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

exports.createInvoice = async (req, res) => {
  try {
    const {
      customer,
      companyFrom,
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

    const user = req.user.id;

    if (
      !user ||
      !customer ||
      !invoiceNumber ||
      !invoiceDate ||
      !dueDate ||
      !items?.length
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Invoice.findOne({ user, invoiceNumber });
    if (existing) {
      return res.status(400).json({
        message: `Invoice number "${invoiceNumber}" already exists for your account.`,
      });
    }

    let netTotal = 0;
    let vatTotal = 0;
    const processedItems = [];

    for (const item of items) {
      if (item.type === "text") {
        processedItems.push({
          type: "text",
          text: item.text,
          vatPercent: item.vatPercent || 25,
          discountPercent: item.discountPercent || 0,
        });
        continue;
      }

      let { productId, quantity, discountPercent = 0, vatPercent, text } = item;

      let product = item.product;
      let price = item.price;
      let unit = item.unit;
      let productCode = "-";

      if (productId) {
        const prod = await Product.findById(productId);
        if (!prod) {
          return res
            .status(400)
            .json({ message: `Invalid productId: ${productId}` });
        }

        product = prod.name;
        unit = prod.unit;
        price = prod.price;
        vatPercent = prod.tax;
        productCode = prod.productCode || "-";
      }

      const discount = price * quantity * (discountPercent / 100);
      const net = price * quantity - discount;
      const vat = net * (vatPercent / 100);

      netTotal += net;
      vatTotal += vat;

      processedItems.push({
        type: "product",
        productId,
        productCode, // ✅ now correctly included
        product,
        text,
        quantity,
        unit,
        price,
        vatPercent,
        discountPercent,
      });
    }

    const grandTotal = netTotal + vatTotal;

    const invoice = new Invoice({
      user,
      companyFrom,
      customer,
      invoiceNumber,
      invoiceDate,
      paymentTerms,
      dueDate,
      yourReference,
      ourReference,
      language,
      currency,
      items: processedItems,
      netTotal,
      vatTotal,
      grandTotal,
      notes,
    });

    const saved = await invoice.save();
    const populated = await Invoice.findById(saved._id)
      .populate("customer", "companyName email")
      .populate(
        "companyFrom",
        "companyName address zip city orgNumber email phone"
      );

    return res.status(201).json(populated);
  } catch (err) {
    console.error("💥 Error in createInvoice:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // 🔒 always filter by logged-in user
    const filter = { user: userId };

    const invoices = await Invoice.find(filter)
      .populate("customer", "companyName email")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoiceId = req.params.id;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      user: userId,
    })
      .populate("customer")
      .populate("companyFrom");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};
