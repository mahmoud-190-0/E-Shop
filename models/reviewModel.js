const mongoose = require("mongoose");

const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [100, "Review title must be at most 100 characters."],
        },
        ratings: {
            type: Number,
            min: [1, "Ratings must be at least 1."],
            max: [5, "Ratings must be at most 5."],
            required: [true, "Review ratings required."],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user."],
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [true, "Review must belong to a product."],
        },
    },
    {
        timestamps: true, // ← handles createdAt + updatedAt automatically
    },
);
reviewSchema.pre(/^find/, async function () {
    this.populate({
        path: "user",
        select: "name",
    });
});

// Average ratings and number of ratings
reviewSchema.statics.calcAverageAndNumRatings = async function (productId) {
    const resulte = await this.aggregate([
        //stage 1 get all reviews for spesific product
        {
            $match: { product: productId },
        },
        //stage 2 get average and number of ratings
        {
            $group: {
                _id: "$product",
                numRatings: { $sum: 1 },
                avgRatings: { $avg: "$ratings" },
            },
        },
        //stage 3 update product
    ]);
    if (resulte.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: resulte[0].numRatings,
            ratingsAverage: resulte[0].avgRatings,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 0,
        });
    }
};
// Call calcAverageAndNumRatings after save on create
reviewSchema.post("save", async function () {
    await this.constructor.calcAverageAndNumRatings(this.product);
});
// Call calcAverageAndNumRatings after delete
reviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageAndNumRatings(doc.product);
    }
});
// Call calcAverageAndNumRatings after update
reviewSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageAndNumRatings(doc.product);
    }
});
module.exports = mongoose.model("Review", reviewSchema);
