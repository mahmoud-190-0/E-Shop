const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const stripe = require("../config/stripe");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// @desc    Create a cash order
// @route   POST /api/v1/orders
// @access  Private (user only)
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    // 1) Get the user's cart.
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError("Cart not found", 404));
    }

    // 2) Ensure the cart is not empty.
    if (cart.cartItems.length === 0) {
        return next(new ApiError("Cart is empty", 400));
    }

    // 3) Build the pricing structure.
    const itemsPrice = cart.totalPrice;
    const discount = cart.discountValue || 0;
    const shippingPrice = 0;
    const totalOrderPrice = itemsPrice + shippingPrice;
    const totalPriceAfterDiscount = Math.floor(totalOrderPrice - discount);

    // 4) Create the order.
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        totalPriceAfterDiscount,
        paymentMethodType: "cash",
        isPaid: false,
    });

    // 5) Decrease product stock and increase sold counter.
    for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: {
                quantity: -item.quantity,
                sold: item.quantity,
            },
        });
    }

    // 6) Clear the cart after a successful order.
    cart.cartItems = [];
    cart.totalPrice = 0;
    cart.discountValue = 0;
    cart.coupon = undefined;
    cart.totalPriceAfterDiscount = 0;
    await cart.save();

    // 7) Respond with the created order.
    res.status(201).json({
        status: "success",
        message: "Cash order created successfully",
        data: order,
    });
});

// @desc    Get all orders (admin sees all, user sees only theirs)
// @route   GET /api/v1/orders
// @access  Private (admin and user)
exports.getOrders = asyncHandler(async (req, res, next) => {
    // 1) Build the filter based on role:
    //    - regular users only see their own orders.
    //    - admins see all orders.
    let filter = {};
    if (req.user.role === "user") {
        filter = { user: req.user._id };
    }

    // 2) Parse pagination params with sane defaults.
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 3) Fetch paginated orders and total count in parallel.
    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate("user", "name email")
            .populate("cartItems.product", "title price")
            .sort("-createdAt")
            .skip(skip)
            .limit(limit),
        Order.countDocuments(filter),
    ]);

    // 4) Respond with results and pagination metadata.
    res.status(200).json({
        status: "success",
        results: orders.length,
        page,
        total,
        data: orders,
    });
});

// @desc    Get a single order by id
// @route   GET /api/v1/orders/:id
// @access  Private (admin and user)
exports.getSpecificOrder = asyncHandler(async (req, res, next) => {
    // 1) Fetch the order and populate related fields.
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("cartItems.product", "title price image");

    // 2) Handle the case where the order does not exist.
    if (!order) {
        return next(new ApiError("Order not found", 404));
    }

    // 3) Authorization: users can only access their own orders.
    if (
        req.user.role === "user" &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        return next(new ApiError("Not authorized to access this order", 403));
    }

    // 4) Respond with the order.
    res.status(200).json({
        status: "success",
        data: order,
    });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (admin only)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    // 1) Find the order by id.
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("Order not found", 404));
    }

    const newStatus = req.body.status;

    // 2) Validate the requested status is in the allowed list.
    const allowedStatus = [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
    ];
    if (!allowedStatus.includes(newStatus)) {
        return next(new ApiError("Invalid status value", 400));
    }

    // 3) Define valid status transitions per payment method.
    const validTransitions = {
        cash: {
            pending: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: [],
        },
        card: {
            pending: ["paid", "cancelled"],
            paid: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: [],
        },
    };

    // 4) Guard against unknown payment method or current state.
    const method = order.paymentMethodType;
    if (!validTransitions[method] || !validTransitions[method][order.status]) {
        return next(new ApiError("Invalid order state", 400));
    }

    // 5) Reject transitions that aren't allowed from the current status.
    if (!validTransitions[method][order.status].includes(newStatus)) {
        return next(
            new ApiError(
                `Cannot change status from ${order.status} to ${newStatus} for ${method} order`,
                400,
            ),
        );
    }

    // 6) Apply the new status.
    order.status = newStatus;

    // 7) Set timestamps automatically based on the new status.
    if (newStatus === "paid") {
        order.paidAt = Date.now();
    }
    if (newStatus === "delivered") {
        order.deliveredAt = Date.now();
    }

    // 8) Persist and respond.
    await order.save();

    res.status(200).json({
        status: "success",
        message: "Order status updated successfully",
        data: order,
    });
});

// @desc    Cancel an order by the user
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private (user only)
exports.cancelOrderByUser = asyncHandler(async (req, res, next) => {
    // 1) Find the order by id.
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("Order not found", 404));
    }

    // 2) Ensure the user owns this order.
    if (order.user.toString() !== req.user._id.toString()) {
        return next(new ApiError("Not authorized", 403));
    }

    // 3) Only pending orders can be cancelled by the user.
    if (order.status !== "pending") {
        return next(new ApiError("Order cannot be cancelled now", 400));
    }

    // 4) Mark the order as cancelled.
    order.status = "cancelled";

    // 5) Roll back product stock (restore quantity, decrement sold).
    for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: {
                quantity: item.quantity,
                sold: -item.quantity,
            },
        });
    }

    // 6) Persist and respond.
    await order.save();

    res.status(200).json({
        status: "success",
        message: "Order cancelled successfully",
        data: order,
    });
});

// @desc    Cancel an order by the user (atomic: status + stock rollback)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private (user only)
exports.cancelOrderByUser = asyncHandler(async (req, res, next) => {
    // 1) Start a session + transaction.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2) Find the order by id (inside the transaction).
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            return next(new ApiError("Order not found", 404));
        }

        // 3) Ensure the user owns this order.
        if (order.user.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return next(new ApiError("Not authorized", 403));
        }

        // 4) Only pending orders can be cancelled by the user.
        if (order.status !== "pending") {
            await session.abortTransaction();
            return next(new ApiError("Order cannot be cancelled now", 400));
        }

        // 5) Mark the order as cancelled.
        order.status = "cancelled";

        // 6) Roll back product stock (restore quantity, decrement sold).
        for (const item of order.cartItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        quantity: item.quantity,
                        sold: -item.quantity,
                    },
                },
                { session },
            );
        }

        // 7) Persist the order inside the transaction.
        await order.save({ session });

        // 8) Commit all writes atomically.
        await session.commitTransaction();

        // 9) Respond with the cancelled order.
        res.status(200).json({
            status: "success",
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (err) {
        // 10) Roll back on any error.
        await session.abortTransaction();
        next(err);
    } finally {
        // 11) Always end the session.
        session.endSession();
    }
});

// @desc    Create a Stripe checkout session
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  Private (user only)
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
    // 1) App-level pricing config (currently zero).
    const taxPrice = 0;
    const shippingPrice = 0;

    // 2) Get the user's cart.
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.cartItems.length === 0) {
        return next(new ApiError("Cart is empty", 400));
    }

    // 3) Compute the price to charge.
    //    Prefer the discounted total when a coupon was applied.
    const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;
    const finalPrice = Math.floor(totalPrice);

    // 4) Stripe expects the smallest currency unit (piasters for EGP).
    const amount = Math.round(finalPrice * 100);

    // 5) Create the Stripe checkout session.
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: "Cart Checkout",
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/orders`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        // ✅ Use the ACTUAL cart._id, not req.params.cartId (which may be undefined)
        client_reference_id: cart._id.toString(),
        metadata: {
            userId: req.user._id.toString(),
            // cartId: cart._id.toString(), // ← redundant if using client_reference_id
            // shippingAddress: JSON.stringify(req.body.shippingAddress),
        },
    });

    // 6) Respond with the session.
    res.status(200).json({
        status: "success",
        session,
    });
});

// @desc    Handle Stripe webhook for payment confirmation
// @route   POST /api/v1/orders/webhook
// @access  Public (Stripe calls this endpoint)
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    // 1) Get the signature from the Stripe header
    const sig = req.headers["stripe-signature"];

    // 2) Verify the event came from Stripe
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        console.log("❌ WEBHOOK ERROR:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔥 WEBHOOK HIT — TYPE:", event.type);

    // 3) Handle the payment confirmation
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        try {
            await createOrderFromSession(session);
        } catch (err) {
            // Log but don't crash — always respond 200 so Stripe doesn't spam retries
            console.error("createOrderFromSession failed:", err.message);
        }
    }

    // 4) Always respond 200
    res.status(200).json({ received: true });
});

// ==================== Helper ====================

// @desc    Convert a completed Stripe session into an Order (atomic + idempotent)
// @access  Internal
const createOrderFromSession = async (session) => {
    // 1) Start a transaction — order + stock + cart all succeed or fail together
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        // 2) Idempotency: skip if this session was already processed
        const existingOrder = await Order.findOne({
            stripeSessionId: session.id,
        }).session(dbSession);

        if (existingOrder) {
            console.log(`Order already exists for session ${session.id} — skipping`);
            await dbSession.abortTransaction();
            return existingOrder;
        }

        // 3) Extract identifiers
        const cartId = session.client_reference_id;
        const userId = session.metadata?.userId;

        if (!cartId || !userId) {
            throw new Error("Missing cartId or userId in session");
        }

        // 4) Load the cart (inside the transaction)
        const cart = await Cart.findById(cartId).session(dbSession);
        if (!cart) {
            throw new Error(`Cart not found: ${cartId}`);
        }
        if (cart.cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // 5) Create the order
        const [order] = await Order.create(
            [
                {
                    user: userId,
                    cartItems: cart.cartItems,
                    totalOrderPrice: session.amount_total / 100,
                    paymentMethodType: "card",
                    isPaid: true,
                    paidAt: new Date(),
                    stripeSessionId: session.id,
                    shippingAddress: session.metadata?.shippingAddress
                        ? JSON.parse(session.metadata.shippingAddress)
                        : undefined,
                },
            ],
            { session: dbSession },
        );

        // 6) Decrease stock and increase sold
        for (const item of order.cartItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        quantity: -item.quantity,
                        sold: item.quantity,
                    },
                },
                { session: dbSession },
            );
        }

        // 7) Delete the cart
        await Cart.findByIdAndDelete(cartId, { session: dbSession });

        // 8) Commit everything
        await dbSession.commitTransaction();

        console.log(
            `✅ Order created for user ${userId} — total: ${order.totalOrderPrice}`,
        );
        return order;
    } catch (err) {
        // 9) Roll back on any error
        await dbSession.abortTransaction();
        console.error("createOrderFromSession failed:", err.message);
        throw err;
    } finally {
        // 10) Always end the session
        dbSession.endSession();
    }
};