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
    bankgiro, // ✅ Include this
  } = req.body;

  const userId = req.user?._id || req.user || null;

  if (!bankgiro) {
    console.log("⛔ bankgiro missing in req.body!");
    return res.status(400).json({ message: "Bankgiro is required" });
  }

  const company = await Company.create({
    user: userId,
    type,
    companyName,
    orgNumber,
    vatNumber,
    email,
    sendBy,
    attachPdf,
    billingAddress,
    bankgiro, // ✅ Must be passed here
  });

  res.status(201).json(company);
});

/**
 * @desc    Get the logged-in user's company
 * @route   GET /api/companies
 * @access  Private
 */
const getCompany = asyncHandler(async (req, res) => {
  const companies = await Company.find({ user: req.user._id });

  if (!companies || companies.length === 0) {
    res.status(404);
    throw new Error("No companies found for this user");
  }

  res.status(200).json(companies);
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
