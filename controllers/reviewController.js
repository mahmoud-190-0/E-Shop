// controllers/reviewController.js
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
const Review = require("../models/reviewModel");

/* ... keep existing exports ... */

// @desc    Get all reviews (admin) with populated user + product
// @route   GET /api/v1/reviews/admin
// @access  Private (admin, manager)
exports.getAllReviewsAdmin = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by rating
    if (req.query.rating) {
        const r = parseInt(req.query.rating);
        if (r >= 1 && r <= 5) filter.ratings = r;
    }

    // Filter by product
    if (req.query.productId) filter.product = req.query.productId;

    // Filter by user
    if (req.query.userId) filter.user = req.query.userId;

    const [reviews, total] = await Promise.all([
        Review.find(filter)
            .populate("user", "name email profileImage")
            .populate("product", "title imageCover price")
            .sort(req.query.sort === "oldest" ? "createdAt" : "-createdAt")
            .skip(skip)
            .limit(limit),
        Review.countDocuments(filter),
    ]);

    res.status(200).json({
        status: "success",
        results: reviews.length,
        page,
        total,
        numberOfPages: Math.ceil(total / limit),
        data: reviews,
    });
});

// @desc    Get review statistics
// @route   GET /api/v1/reviews/stats
// @access  Private (admin, manager)
exports.getReviewStats = asyncHandler(async (req, res) => {
    const stats = await Review.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                averageRating: { $avg: "$ratings" },
                fiveStars: { $sum: { $cond: [{ $eq: ["$ratings", 5] }, 1, 0] } },
                fourStars: { $sum: { $cond: [{ $eq: ["$ratings", 4] }, 1, 0] } },
                threeStars: { $sum: { $cond: [{ $eq: ["$ratings", 3] }, 1, 0] } },
                twoStars: { $sum: { $cond: [{ $eq: ["$ratings", 2] }, 1, 0] } },
                oneStar: { $sum: { $cond: [{ $eq: ["$ratings", 1] }, 1, 0] } },
            },
        },
    ]);

    const result = stats[0] || {
        total: 0,
        averageRating: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0,
    };

    res.status(200).json({
        status: "success",
        data: result,
    });
});

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
exports.createFilterObject = (req, res, next) => {
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