const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const category = require("../models/categoryModel");
const factory = require("./factoryHandler");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { uploadSingleImage } = require("../Middleware/uploadImageMiddleware");

/* *************************** IMAGE MIDDLEWARE *******************************/

// @desc    Resize the uploaded category image and upload it to Cloudinary
// @route   Middleware (used before create/update category routes)
// @access  Private
exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  // Skip if no file was uploaded
  if (!req.file) return next();

  // Resize the image buffer to 600x600 and convert to JPEG
  const imageBufferCategory = await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  // Upload the processed image to Cloudinary
  const imageUrl = await uploadToCloudinary(imageBufferCategory, "category");

  // Attach the image URL to the request body
  req.body.image = imageUrl;

  next();
});

// @desc    Upload a single category image (field name: image)
// @route   Middleware (used before create/update category routes)
// @access  Private
exports.uploadCategoryImage = uploadSingleImage("image");

/* *************************** CATEGORIES CONTROLLERS *******************************/

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategory = factory.getAll(category);

// @desc    Get a specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getSpecificCategory = factory.getOne(category);

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private (admin, manager)
exports.createCategory = factory.createOne(category);

// @desc    Update a specific category by id
// @route   PUT /api/v1/categories/:id
// @access  Private (admin, manager)
exports.updateCategory = factory.updateOne(category);

// @desc    Delete a specific category by id
// @route   DELETE /api/v1/categories/:id
// @access  Private (admin, manager)
exports.deleteCategory = factory.deleteOne(category);

// @desc    Get a specific category by id
// @route   GET /api/v1/categories/stats
// @access  Private (admin, manager)
exports.getCategoryStats = asyncHandler(async (req, res) => {
  const Product = require("../models/productModel");
  const SubCategory = require("../models/subCategoryModel");
  const Category = require("../models/categoryModel");

  const [total, catsWithProducts, emptyCats, recent] = await Promise.all([
    Category.countDocuments(),
    Product.distinct("category").then((ids) => ids.length),
    Category.countDocuments().then(async (totalCount) => {
      const used = await Product.distinct("category");
      return totalCount - used.length;
    }),
    Category.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 864e5) },
    }),
  ]);

  res.json({
    status: "success",
    data: { total, withProducts: catsWithProducts, empty: emptyCats, recent },
  });
});

