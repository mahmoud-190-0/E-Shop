const asyncHandler = require("express-async-handler");

const Coupon = require("../models/couponModel");
const ApiError = require("../utils/ApiError"); // adjust path if needed

// ==================== ADMIN COUPONS ====================

// @desc    Create a new coupon
// @route   POST /api/v1/coupons
// @access  Private (admin only)
exports.createCoupon = asyncHandler(async (req, res, next) => {
    // 1) Create the coupon from the request body.
    const coupon = await Coupon.create(req.body);

    // 2) Respond with the created coupon.
    res.status(201).json({
        status: "success",
        message: "Coupon created successfully",
        data: coupon,
    });
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private (admin only)
exports.getAllCoupons = asyncHandler(async (req, res, next) => {
    // 1) Fetch all coupons from the database.
    const coupons = await Coupon.find();

    // 2) Respond with the list and a count.
    res.status(200).json({
        status: "success",
        results: coupons.length,
        data: coupons,
    });
});

// @desc    Update a specific coupon by id
// @route   PUT /api/v1/coupons/:id
// @access  Private (admin only)
exports.updateCoupon = asyncHandler(async (req, res, next) => {
    // 1) Update the coupon with the fields from the request body.
    const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,          // return the updated document
            runValidators: true // run schema validators on update
        }
    );

    // 2) Handle the case where the coupon does not exist.
    if (!coupon) {
        return next(new ApiError("Coupon not found", 404));
    }

    // 3) Respond with the updated coupon.
    res.status(200).json({
        status: "success",
        message: "Coupon updated successfully",
        data: coupon,
    });
});

// @desc    Delete a specific coupon by id
// @route   DELETE /api/v1/coupons/:id
// @access  Private (admin only)
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
    // 1) Delete the coupon by id.
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    // 2) Handle the case where the coupon does not exist.
    if (!coupon) {
        return next(new ApiError("Coupon not found", 404));
    }

    // 3) Respond with a success message (no data to return).
    res.status(200).json({
        status: "success",
        message: "Coupon deleted successfully",
    });
});

// @desc    Get a specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private (admin only)
exports.getSpecificCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // 1) Fetch the coupon by id.
    const coupon = await Coupon.findById(id);

    // 2) Handle the case where the coupon does not exist.
    if (!coupon) {
        return next(new ApiError("Coupon not found", 404));
    }

    // 3) Respond with the coupon.
    res.status(200).json({
        status: "success",
        message: "Coupon fetched successfully",
        data: coupon,
    });
});

// @desc    Get coupon statistics
// @route   GET /api/v1/coupons/stats
// @access  Private (admin, manager)
exports.getCouponStats = asyncHandler(async (req, res, next) => {
    const now = new Date();

    // 1) Fetch all coupons in one query (small dataset, cheap)
    const coupons = await Coupon.find().select(
        "active expire usageLimit usedCount discount discountType"
    );

    // 2) Compute stats client-side from the loaded docs
    const total = coupons.length;
    const active = coupons.filter(
        (c) =>
            c.active &&
            (!c.expire || new Date(c.expire) > now) &&
            (c.usageLimit === 0 || c.usedCount < c.usageLimit)
    ).length;

    const expired = coupons.filter(
        (c) => c.expire && new Date(c.expire) <= now
    ).length;

    const exhausted = coupons.filter(
        (c) =>
            c.usageLimit > 0 &&
            c.usedCount >= c.usageLimit &&
            (!c.expire || new Date(c.expire) > now)
    ).length;

    const inactive = coupons.filter((c) => !c.active).length;

    const totalRedemptions = coupons.reduce(
        (sum, c) => sum + (c.usedCount || 0),
        0
    );

    res.status(200).json({
        status: "success",
        data: {
            total,
            active,
            expired,
            exhausted,
            inactive,
            totalRedemptions,
        },
    });
});