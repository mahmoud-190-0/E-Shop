const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Product = require("../models/productModel");
const ApiError = require("../utils/ApiError");

// @desc    Add a product to the logged-in user's wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private (user only)
exports.addToWishlist = asyncHandler(async (req, res, next) => {
    // 1) Add the product to the wishlist.
    //    $addToSet prevents duplicates (unlike $push).
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.params.productId } },
        { new: true }, // 2) Return the updated document.
    );

    // 3) Handle the case where the user no longer exists.
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 4) Respond with the updated wishlist.
    res.status(200).json({
        status: "success",
        message: "Product added to wishlist",
        data: user.wishlist,
    });
});

// @desc    Remove a product from the logged-in user's wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private (user only)
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
    // 1) Fetch the user first so we can verify the product is in the wishlist.
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Make sure the product is actually in the wishlist before removing it.
    const isInWishlist = user.wishlist.some(
        (id) => id.toString() === req.params.productId,
    );
    if (!isInWishlist) {
        return next(new ApiError("Product not in wishlist", 404));
    }

    // 3) Remove the product from the wishlist using $pull.
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                wishlist: req.params.productId,
            },
        },
        { new: true },
    );

    // 4) Respond with the updated wishlist.
    res.status(200).json({
        status: "success",
        message: "Product removed from wishlist",
        data: updatedUser.wishlist,
    });
});

// @desc    Get the logged-in user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private (user only)
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    // 1) Fetch the user and populate wishlist product details.
    //    Only select the fields the client actually needs.
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        select: "title price imageCover ratingsAverage",
    });

    // 2) Handle the case where the user no longer exists.
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Respond with the wishlist and an item count.
    res.status(200).json({
        status: "success",
        results: user.wishlist.length,
        data: user.wishlist,
    });
});
