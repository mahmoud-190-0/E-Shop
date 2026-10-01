const SubCategory = require("../models/subCategoryModel");
const factory = require("./factoryHandler");

/* ************ SUBCATEGORY WITH CATEGORY MIDDLEWARE ***********/

// @desc    Set the categoryId from route params into the request body
// @route   Middleware (used in nested subcategory routes)
// @access  Private
exports.setcategoryIdToBody = (req, res, next) => {
  // Only set it if not already provided in the body
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc    Build a filter object based on categoryId from route params
// @route   Middleware (used in nested subcategory routes)
// @access  Public
exports.createfillterobject = (req, res, next) => {
  let filterObject = {};

  // Filter subcategories by categoryId if it exists in params
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  // Attach filter object to request for the factory handler
  req.filterObj = filterObject;
  next();
};

/* *************************** SUBCATEGORIES CONTROLLERS *******************************/

// @desc    Get all subcategories (with filtering, searching, sorting, and pagination)
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get a specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSpecificSubCategory = factory.getOne(SubCategory);

// @desc    Create a new subcategory
// @route   POST /api/v1/subcategories
// @access  Private (admin, manager)
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Update a specific subcategory by id
// @route   PUT /api/v1/subcategories/:id
// @access  Private (admin, manager)
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete a specific subcategory by id
// @route   DELETE /api/v1/subcategories/:id
// @access  Private (admin, manager)
exports.deleteSubCategory = factory.deleteOne(SubCategory);