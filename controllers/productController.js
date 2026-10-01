const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { uploadMixImage } = require("../Middleware/uploadImageMiddleware");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const Product = require("../models/productModel");
const factory = require("./factoryHandler");

/**************************** IMAGE MIDDLEWARE *******************************/

// @desc    Resize the uploaded product images (cover + gallery) and upload them to Cloudinary
// @route   Middleware (used before create/update product routes)
// @access  Private
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
    // Resize and upload the image cover (single image)
    if (req.files.imageCover) {
        const imageCoverBuffer = await sharp(req.files.imageCover[0].buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toBuffer();

        const imageUrl = await uploadToCloudinary(imageCoverBuffer, "products");
        req.body.imageCover = imageUrl;
    }

    // Resize and upload the gallery images (multiple images)
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (img) => {
                const imagesBuffer = await sharp(img.buffer)
                    .resize(600, 600)
                    .toFormat("jpeg")
                    .jpeg({ quality: 100 })
                    .toBuffer();

                const imageUrl = await uploadToCloudinary(imagesBuffer, "products");
                req.body.images.push(imageUrl);
            }),
        );
    }

    next();
});

// @desc    Upload mixed product images (imageCover: 1, images: 5)
// @route   Middleware (used before create/update product routes)
// @access  Private
exports.uploadProductImage = uploadMixImage([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
]);

/* *************************** PRODUCTS CONTROLLERS *******************************/

// @desc    Get all products (with filtering, searching, sorting, and pagination)
// @route   GET /api/v1/products
// @access  Public
exports.getProduct = factory.getAll(Product, "Product");

// @desc    Get a specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getSpecificProduct = factory.getOne(Product, "reviews");

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private (admin, manager)
exports.createProduct = factory.createOne(Product);

// @desc    Update a specific product by id
// @route   PUT /api/v1/products/:id
// @access  Private (admin, manager)
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete a specific product by id
// @route   DELETE /api/v1/products/:id
// @access  Private (admin, manager)
exports.deleteProduct = factory.deleteOne(Product);