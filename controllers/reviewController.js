
const factory = require("./factoryHandler");
const Review = require("../models/reviewModel");


/* ************ REVIEW WITH PRODUCT  MIDDLEWARE ***********/

// @desc    Set the produc Id from route params into the request body
// @route   Middleware (used in nested reviews routes)
// @access  Private
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    // Only set it if not already provided in the body
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// @desc    Build a filter object based on productId from route params
// @route   Middleware (used in nested reviews routes)
// @access  Public
exports.createfillterobject = (req, res, next) => {
    let filterObject = {};

    // Filter reviews by productId if it exists in params
    if (req.params.productId) filterObject = { product: req.params.productId };

    // Attach filter object to request for the factory handler
    req.filterObj = filterObject;
    next();
};

// @desc    Get all Reviews
// @route   GET /api/v1/brands
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get a specific Review by id
// @route   GET /api/v1/Reviews/:id
// @access  Public
exports.getSpecificReview = factory.getOne(Review);

// @desc    Create a new Review
// @route   POST /api/v1/Reviews
// @access  Private /protect /user
exports.createReview = factory.createOne(Review);

// @desc    Update a specific Review by id
// @route   PUT /api/v1/Reviews/:id
// @access  Private /protect /user
exports.updateReview = factory.updateOne(Review);

// @desc    Delete a specific Review by id
// @route   DELETE /api/v1/Reviews/:id
// @access  Private /protect /user-admin-manager
exports.deleteReview = factory.deleteOne(Review);