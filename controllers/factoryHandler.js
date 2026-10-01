const ApiFeatures = require("../utils/ApiFeatures");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

/* *************************** FACTORY HANDLERS *******************************/

// @desc    Create a new document in the given model
// @route   Used by createOne routes
// @access  Depends on the route using it
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

// @desc    Get all documents with filtering, searching, sorting, field limiting, and pagination
// @route   Used by getAll routes
// @access  Depends on the route using it
exports.getAll = (Model, ModelName = ``) =>
  asyncHandler(async (req, res) => {
    // Build the base filter (allows nested filters like subcategories)
    const filter = req.filterObj || {};

    // Count total documents for pagination metadata
    const countD = await Model.countDocuments(filter);

    // Build the query with all API features chained
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(ModelName)
      .sort()
      .limitFields()
      .paginate(countD);

    const { mongooseQuery, paginationResult } = features;

    // Execute the final query
    const document = await mongooseQuery;

    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });

// @desc    Get a single document by id
// @route   Used by getOne routes
// @access  Depends on the route using it
exports.getOne = (Model, population) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (population) {
      query = query.populate(population);
    }
    const document = await query;

    // Return error if document not found
    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// @desc    Update a single document by id
// @route   Used by updateOne routes
// @access  Depends on the route using it
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Return error if document not found
    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// @desc    Delete a single document by id
// @route   Used by deleteOne routes
// @access  Depends on the route using it
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    // Return error if document not found
    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document deleted successfully",
      data: document,
    });
  });
