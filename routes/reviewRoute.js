const express = require("express");

const router = express.Router({ mergeParams: true }); // ✅ good — this is correct

const authController = require("../controllers/authController.js");

// Review validators
const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require("../utils/Validators/reviewValidator.js");

// Review controllers
const {
    createReview,
    getReviews,
    getSpecificReview,
    updateReview,
    deleteReview,
    createFilterObject,
    setProductIdAndUserIdToBody,
    getAllReviewsAdmin,
    getReviewStats,
} = require("../controllers/reviewController.js");

// ==================== Routes ====================

// GET  /          → list all reviews (public)
// POST /          → create a review (user only)
router
    .route("/")
    .post(
        authController.protect,
        authController.allowedTo("user"),
        setProductIdAndUserIdToBody,
        createReviewValidator,
        createReview,
    )
    .get(createFilterObject, getReviews);

router.get(
    "/admin",
    authController.protect,
    authController.allowedTo("admin", "manager"),
    getAllReviewsAdmin
);

router.get(
    "/stats",
    authController.protect,
    authController.allowedTo("admin", "manager"),
    getReviewStats
);
// GET    /:id → get a specific review (public)
// PUT    /:id → update a review (owner)
// DELETE /:id → delete a review (admin, manager, or owner)
router
    .route("/:id")
    .get(getReviewValidator, getSpecificReview)
    .put(
        authController.protect,
        authController.allowedTo("user"),
        updateReviewValidator,
        updateReview,
    )
    .delete(
        authController.protect,
        authController.allowedTo("user", "admin", "manager"),
        deleteReviewValidator,
        deleteReview,
    );

module.exports = router;