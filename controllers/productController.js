const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { uploadMixImage } = require("../Middleware/uploadImageMiddleware");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const Product = require("../models/productModel");
const factory = require("./factoryHandler");


/* ************ PRODUCTS WITH SUBCATEGORY MIDDLEWARE ***********/

// @desc    Set the subcategoryId from route params into the request body
// @route   Middleware (used in nested product routes)
// @access  Private
exports.setSubcategoryIdToBody = (req, res, next) => {
    // Only set it if not already provided in the body
    if (!req.body.subcategory) req.body.subcategory = req.params.subcategoryId;
    next();
};

// @desc    Build a filter object based on subcategoryId from route params
// @route   Middleware (used in nested product routes)
// @access  Public
exports.createFilterObject = (req, res, next) => {
    let filterObject = {};

    if (req.params.subcategoryId) {
        filterObject = {
            subcategories: req.params.subcategoryId,
        };
    }

    req.filterObj = filterObject;
    next();
};
/**************************** IMAGE MIDDLEWARE *******************************/

// @desc    Resize the uploaded product images (cover + gallery) and upload them to Cloudinary
// @route   Middleware (used before create/update product routes)
// @access  Private

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
    // Resize and upload the image cover
    if (req.files?.imageCover?.length) {
        const imageCoverBuffer = await sharp(
            req.files.imageCover[0].buffer
        )
            .resize(600, 600)
            .jpeg({ quality: 90 })
            .toBuffer();

        const imageUrl = await uploadToCloudinary(
            imageCoverBuffer,
            "products"
        );

        req.body.imageCover = imageUrl;
    }

    // Resize and upload gallery images
    if (req.files?.images?.length) {
        const imagesUrls = await Promise.all(
            req.files.images.map(async (img) => {
                const imagesBuffer = await sharp(img.buffer)
                    .resize(600, 600)
                    .jpeg({ quality: 90 })
                    .toBuffer();

                return uploadToCloudinary(
                    imagesBuffer,
                    "products"
                );
            })
        );

        req.body.images = imagesUrls;
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