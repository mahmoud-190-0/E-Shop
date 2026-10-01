const sharp = require("sharp");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./factoryHandler");
const User = require("../models/userModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { uploadSingleImage } = require("../Middleware/uploadImageMiddleware");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/jwtToken");

/* *************************** IMAGE MIDDLEWARE *******************************/

// @desc    Resize the uploaded user image and upload it to Cloudinary
// @route   Middleware (used before create/update user routes)
// @access  Private
exports.resizeUserImage = asyncHandler(async (req, res, next) => {
    // 1) Skip if no file was uploaded.
    if (!req.file) return next();

    // 2) Resize the image buffer to 400x400 and convert to JPEG.
    const imageBuffer = await sharp(req.file.buffer)
        .resize(400, 400)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

    // 3) Upload the processed image to Cloudinary.
    const imageUrl = await uploadToCloudinary(imageBuffer, "users");

    // 4) Attach the image URL to the request body for the controller.
    req.body.profileImage = imageUrl;

    next();
});

// @desc    Upload a single user image (field name: profileImage)
// @route   Middleware (used before create/update user routes)
// @access  Private
exports.uploadUserImage = uploadSingleImage("profileImage");

/* *************************** USERS CONTROLLERS *******************************/

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (admin only)
exports.getUsers = factory.getAll(User);

// @desc    Get a specific user by id
// @route   GET /api/v1/users/:id
// @access  Private (admin only)
exports.getSpecificUser = factory.getOne(User);

// @desc    Create a new user
// @route   POST /api/v1/users
// @access  Private (admin only)
exports.createUser = factory.createOne(User);

// @desc    Update a specific user by id
// @route   PUT /api/v1/users/:id
// @access  Private (admin only)
exports.updateUser = asyncHandler(async (req, res, next) => {
    // 1) Generate a slug from the name if it was provided.
    if (req.body.name) {
        req.body.slug = slugify(req.body.name, { lower: true });
    }

    // 2) Update the user with only the allowed fields.
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true, // return the updated document
            runValidators: true, // run schema validators on update
        },
    );

    // 3) Return an error if the user does not exist.
    if (!document) {
        return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // 4) Respond with the updated user.
    res.status(200).json({
        status: "success",
        data: document,
    });
});

// @desc    Deactivate a specific user by id
// @route   DELETE /api/v1/users/:id
// @access  Private (admin only)
exports.deactivateUser = asyncHandler(async (req, res, next) => {
    // 1) Find the user by id.
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Soft delete: mark the user as inactive.
    user.active = false;
    await user.save();

    // 3) Respond with a success message.
    res.status(200).json({
        status: "success",
        message: "User deactivated successfully",
    });
});

// @desc    Activate a specific user by id
// @route   PUT /api/v1/users/:id/activate
// @access  Private (admin only)
exports.activateUser = asyncHandler(async (req, res, next) => {
    // 1) Find the user by id.
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Reactivate the user.
    user.active = true;
    await user.save();

    // 3) Respond with a success message.
    res.status(200).json({
        status: "success",
        message: "User activated successfully",
    });
});

// @desc    Change a specific user's password by id
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private (admin only)
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Find the user and include the password field (hidden by default).
    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
        return next(new ApiError(`User not found with id ${req.params.id}`, 404));
    }

    // 2) Set the new password and track the change timestamp.
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now() - 1000;
    await user.save();

    // 3) Respond with a success message.
    res.status(200).json({
        status: "success",
        message: "Password changed successfully",
    });
});

// @desc    Get logged-in user data (sets req.params.id from token)
// @route   GET /api/v1/users/getMe
// @access  Private/Protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    // 1) Override params id with the logged-in user's id,
    //    then hand off to getOne (or the next handler in the chain).
    req.params.id = req.user.id;
    next();
});

// @desc    Update logged-in user's password
// @route   PUT /api/v1/users/changeMyPassword
// @access  Private/Protected
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Get the logged-in user with the password field included.

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Check if the current password is correct.
    const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
    );

    if (!isCorrect) {
        return next(new ApiError("Current password is incorrect", 400));
    }

    //3 ) Update the password and track the change timestamp.
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now() - 1000;

    await user.save();
    // 4) Issue a fresh token since the password changed.

    const token = generateToken(user._id);
    // 5) Hide the password before sending the response.

    user.password = undefined;

    res.status(200).json({
        status: "success",
        data: user,
        token,
    });
});

// @desc    Update logged-in user's data (name, email, phone, profileImage)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    // 1) Get the logged-in user.
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Update only the fields the user is allowed to change themselves.
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;

    // 3) Persist the changes.
    await user.save();

    // 4) Respond with the updated user.
    res.status(200).json({
        status: "success",
        data: user,
    });
});

// @desc    Deactivate the logged-in user (soft delete)
// @route   DELETE /api/v1/users/DeleteMe
// @access  Private/Protected
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    // 1) Find the logged-in user.
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Soft delete: mark as inactive.
    user.active = false;
    await user.save();

    // 3) Respond with a success message.
    res.status(200).json({
        status: "success",
        message: "Account deactivated successfully",
    });
});
