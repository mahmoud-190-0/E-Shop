const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");

const Brand = require("../models/brandModel");
const Product = require("../models/productModel");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { uploadSingleImage } = require("../Middleware/uploadImageMiddleware");

/* *************************** IMAGE MIDDLEWARE *******************************/

// @desc    Resize the uploaded brand image and upload it to Cloudinary
// @route   Middleware (used before create/update brand routes)
// @access  Private
exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
    // Skip if no file was uploaded
    if (!req.file) return next();

    // Resize the image buffer to 400x400 and convert to JPEG
    const imageBuffer = await sharp(req.file.buffer)
        .resize(400, 400)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

    // Upload the processed image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageBuffer, "brands");

    // Attach the image URL to the request body
    req.body.image = imageUrl;

    next();
});

// @desc    Upload a single brand image (field name: image)
// @route   Middleware (used before create/update brand routes)
// @access  Private
exports.uploadBrandImage = uploadSingleImage("image");

/* *************************** BRANDS CONTROLLERS *******************************/

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrand = factory.getAll(Brand);

// @desc    Get a specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getSpecificBrand = factory.getOne(Brand);

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private (admin, manager)
exports.createBrand = factory.createOne(Brand);

// @desc    Update a specific brand by id
// @route   PUT /api/v1/brands/:id
// @access  Private (admin, manager)
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete a specific brand by id
// @route   DELETE /api/v1/brands/:id
// @access  Private (admin, manager)
exports.deleteBrand = factory.deleteOne(Brand);

//@desc     Get Brand stats
//@route    GET /api/v1/brands/stats
//@access   private(admin, manager)
exports.getBrandStats = asyncHandler(async (req, res) => {
    const [total, usedBrandIds] = await Promise.all([
        Brand.countDocuments(),
        Product.distinct("brand", { brand: { $ne: null } }),
    ]);

    const withProducts = usedBrandIds.length;
    const withoutProducts = total - withProducts;

    const recent = await Brand.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 864e5) },
    });

    res.status(200).json({
        status: "success",
        data: { total, withProducts, withoutProducts, recent },
    });
});
