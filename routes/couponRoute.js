const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getSpecificCoupon,
} = require("../controllers/couponController");

const {
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator,
    getCouponValidator,
} = require("../utils/Validators/cartAndCouponValidator");

// ==================== Routes ====================

// POST /coupons → create a new coupon (admin only)
// GET  /coupons → list all coupons (admin only)
// All coupon routes require admin access
router.use(authController.protect, authController.allowedTo("admin"));

router
    .route("/")
    .post(createCouponValidator, createCoupon)
    .get(getAllCoupons);

// GET    /coupons/:id → get a specific coupon (admin only)
// PUT    /coupons/:id → update a coupon (admin only)
// DELETE /coupons/:id → delete a coupon (admin only)
router
    .route("/:id")
    .get(getCouponValidator, getSpecificCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);


module.exports = router;