const Company = require("../models/Company");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Create or update the logged-in user's company
 * @route   POST /api/companies
 * @access  Private
 */
const saveCompany = asyncHandler(async (req, res) => {
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

  if (!type || !companyName) {
    res.status(400);
    throw new Error("Type and company name are required");
  }

  const existing = await Company.findOne({ user: req.user._id });

  if (existing) {
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
});

/**
 * @desc    Get the logged-in user's company
 * @route   GET /api/companies
 * @access  Private
 */
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("No company found for this user");
  }

  res.status(200).json(company);
});

/**
 * @desc    Update a specific company by ID (admin or multi-company logic)
 * @route   PUT /api/companies/:id
 * @access  Private
 */
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (company.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
});

/**
 * @desc    Delete a specific company by ID
 * @route   DELETE /api/companies/:id
 * @access  Private
 */
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (company.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await company.deleteOne();

  res.json({ message: "Company removed" });
});

module.exports = {
  saveCompany,
  getCompany,
  updateCompany,
  deleteCompany,
};
