const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
            uppercase: true,
            trim: true,
            minlength: [3, "Too short"],
            maxlength: [20, "Too long"],
        },

        expire: {
            type: Date,
            required: [true, "Expire date required"],
        },

        discount: {
            type: Number,
            required: [true, "Discount value required"],
        },

        discountType: {
            type: String,
            //percentage % or fixed number
            enum: ["percentage", "fixed"],
            default: "percentage",
        },

        minOrder: {
            type: Number,
            default: 0,
        },

        usageLimit: {
            type: Number,
            default: 1,
        },

        usedCount: {
            type: Number,
            default: 0,
        },

        usedBy: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],

        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);
