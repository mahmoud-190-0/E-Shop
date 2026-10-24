const ApiFeatures = require("../utils/ApiFeatures");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");

/* *************************** FACTORY HANDLERS *******************************/

// @desc    Create a new document in the given model
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

// @desc    Get all documents with filtering, searching, sorting, field limiting, and pagination
exports.getAll = (Model, ModelName = ``) =>
  asyncHandler(async (req, res) => {
    // 1) Base filter (used for nested routes like /categories/:id/subcategories)
    const baseFilter = req.filterObj || {};

    // 2) Build query + apply filter/search FIRST so `features.filters` gets set
    const features = new ApiFeatures(Model.find(baseFilter), req.query)
      .filter()              // ← stores the resolved filters in `this.filters`
      .search(ModelName);

    // 3) Count the FILTERED documents (not the whole collection)
    const countFilter = { ...baseFilter, ...(features.filters || {}) };
    const countD = await Model.countDocuments(countFilter);

    // 4) Now apply sort/fields/pagination using the correct count
    features.sort().limitFields().paginate(countD);

    const { mongooseQuery, paginationResult } = features;
    const document = await mongooseQuery;

    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });

// @desc    Get a single document by id
exports.getOne = (Model, population) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);

    if (population) {
      query = query.populate(population);
    }
    const document = await query;

    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// @desc    Update a single document by id
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// @desc    Delete a single document by id
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`document not found ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document deleted successfully",
      data: document,
    });
  });