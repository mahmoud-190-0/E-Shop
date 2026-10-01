const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },

        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: Number,
            },
        ],

        totalPrice: {
            type: Number,
            default: 0,
        },
        discountValue: {
            type: Number,
            default: 0,
        },

        totalPriceAfterDiscount: {
            type: Number,
            default: 0,
        },
        coupon: {
            type: mongoose.Schema.ObjectId,
            ref: "Coupon",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
