const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],

    totalOrderPrice: {
      type: Number,
      required: true,
    },

    totalPriceAfterDiscount: Number,

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paidAt: Date,
    deliveredAt: Date,

    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true },
);
// update order status automatically when status is changed
orderSchema.pre("save", async function () {
  if (this.status === "paid" && !this.paidAt) {
    this.paidAt = Date.now();
  }

  if (this.status === "delivered" && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
});
module.exports = mongoose.model("Order", orderSchema);
