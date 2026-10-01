const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

// @desc    Add a new address to the logged-in user's address list
// @route   POST /api/v1/addresses
// @access  Private (logged-in user only)
exports.addAddress = asyncHandler(async (req, res, next) => {
    // 1) Add the new address to the user's addresses array.
    //    $addToSet prevents duplicates (unlike $push).
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {
                addresses: req.body,
            },
        },
        { new: true }, // 2) Return the updated document.
    );

    // 3) Handle the case where the user no longer exists.
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 4) Send back the updated list of addresses.
    res.status(200).json({
        status: "success",
        message: "Address added",
        data: user.addresses,
    });
});

// @desc    Remove an address from the logged-in user's address list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private (logged-in user only)
exports.removeAddress = asyncHandler(async (req, res, next) => {
    // 1) Remove the matching address object from the array using $pull.
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                addresses: { _id: req.params.addressId },
            },
        },
        { new: true },
    );

    // 2) Handle the case where the user no longer exists.
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Send back the updated list of addresses.
    res.status(200).json({
        status: "success",
        message: "Address removed",
        data: user.addresses,
    });
});

// @desc    Get all addresses of the logged-in user
// @route   GET /api/v1/addresses
// @access  Private (logged-in user only)
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    // 1) Fetch only the addresses field (no need for the whole user document).
    const user = await User.findById(req.user._id).select("addresses");

    // 2) Handle the case where the user no longer exists.
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 3) Send back the addresses with a count.
    res.status(200).json({
        status: "success",
        results: user.addresses.length,
        data: user.addresses,
    });
});

// @desc    Update a specific address of the logged-in user
// @route   PATCH /api/v1/addresses/:addressId
// @access  Private (logged-in user only)
exports.updateAddress = asyncHandler(async (req, res, next) => {
    // 1) Whitelist the fields the user is allowed to update.
    const allowedFields = ["alias", "details", "phone", "city", "postalCode"];

    // 2) Build the $set object only from provided fields.
    const updates = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[`addresses.$.${field}`] = req.body[field];
        }
    });

    // 3) Fail fast if there is nothing to update.
    if (Object.keys(updates).length === 0) {
        return next(new ApiError("No valid fields provided for update", 400));
    }

    // 4) Update the address, ensuring it belongs to the logged-in user.
    const user = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            "addresses._id": req.params.addressId,
        },
        {
            $set: updates,
        },
        { new: true, runValidators: true }, // 5) Return updated document
    );

    // 6) Handle the case where the address was not found.
    if (!user) {
        return next(new ApiError("Address not found", 404));
    }

    // 7) Send back the updated list of addresses.
    res.status(200).json({
        status: "success",
        message: "Address updated",
        data: user.addresses,
    });
});