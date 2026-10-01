const express = require("express");

const router = express.Router();

// Controllers
const {
    createCashOrder,
    getOrders,
    getSpecificOrder,
    updateOrderStatus,
    cancelOrderByUser,
    createCheckoutSession,
} = require("../controllers/orderController.js");

// Auth & Middleware
const { protect, allowedTo } = require("../controllers/authController.js");

const userOnly = allowedTo("user");
const adminOrManager = allowedTo("admin", "manager");

// ==================== Routes ====================

// GET /checkout-session/:cartId → create a Stripe checkout session (user only)
router.get(
    "/checkout-session/:cartId",
    protect,
    userOnly,
    createCheckoutSession,
);

// POST / → user creates a cash order
// GET  / → user sees their orders, admin sees all orders
router
    .route("/")
    .post(protect, userOnly, createCashOrder)
    .get(protect, allowedTo("user", "admin", "manager"), getOrders);

// GET /:id → user or admin retrieves a specific order
router.get("/:id", protect, allowedTo("user", "admin", "manager"), getSpecificOrder);

// PUT /:id/status → admin/manager updates order status
router.put("/:id/status", protect, adminOrManager, updateOrderStatus);

// PUT /:id/cancel → user cancels their own order
router.put("/:id/cancel", protect, userOnly, cancelOrderByUser);

module.exports = router;