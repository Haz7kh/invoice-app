const Company = require("../models/Company");
const asyncHandler = require("express-async-handler");

// @desc    Create or update company info for user
// @route   POST /api/company
// @access  Private
const saveCompany = async (req, res) => {
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

  const existing = await Company.findOne({ user: req.user._id });

  if (existing) {
    // update
    existing.type = type;
    existing.companyName = companyName;
    existing.orgNumber = orgNumber;
    existing.vatNumber = vatNumber;
    existing.email = email;
    existing.sendBy = sendBy;
    existing.attachPdf = attachPdf;
    existing.billingAddress = billingAddress;
    const updated = await existing.save();
    return res.status(200).json(updated);
  }

  // create
  const newCompany = await Company.create({
    user: req.user._id,
    type,
    companyName,
    orgNumber,
    vatNumber,
    email,
    sendBy,
    attachPdf,
    billingAddress,
  });

  res.status(201).json(newCompany);
};

// @desc    Get logged-in user's company info
// @route   GET /api/company
// @access  Private
const getCompany = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) {
    return res.status(404).json({ message: "No company found" });
  }
  res.status(200).json(company);
};

// @desc    Update a company
// @route   PUT /api/customers/:id
// @access  Private
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Make sure the logged-in user owns the company
  if (company.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(updated);
});

// @desc    Delete a company
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  // Check ownership
  if (company.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await company.remove();

  res.json({ message: "Company removed" });
});

module.exports = {
  saveCompany,
  getCompany,
  deleteCompany,
  updateCompany,
};
