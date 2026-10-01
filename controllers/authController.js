const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");

const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const { generateToken } = require("../utils/jwtToken");

// ==================== Auth Controllers ====================

// @desc    Sign up a new user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1) Create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        password: req.body.password,
    });

    // 2) Generate token
    const token = generateToken(user._id);

    // 3) Respond with token and user data
    res.status(201).json({
        status: "success",
        data: user,
        token,
    });
});

// @desc    Log in an existing user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1) Get the user by email and include the password field
    const user = await User.findOne({ email: req.body.email }).select("+password");

    // 2) Reject invalid credentials (same message for both cases for security)
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    // 3) Reject deactivated accounts
    if (!user.active) {
        return next(new ApiError("Account is deactivated", 401));
    }

    // 4) Generate token
    const token = generateToken(user._id);

    // 5) Respond with token and user data (hide password)
    user.password = undefined;
    res.status(200).json({
        status: "success",
        data: user,
        token,
    });
});

// @desc    Make sure the user is logged in before accessing protected routes
// @route   Middleware (applied to protected routes)
// @access  Private
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Get the token from the Authorization header
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(
            new ApiError("You are not logged in! Please log in to get access.", 401),
        );
    }

    // 2) Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new ApiError("Invalid token, please login again", 401));
    }

    // 3) Check the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new ApiError(
                "The user belonging to this token does no longer exist.",
                401,
            ),
        );
    }

    // 4) Check if the password was changed after the token was issued
    if (currentUser.passwordChangedAt) {
        const passchangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10,
        );
        if (decoded.iat < passchangedTimestamp) {
            return next(
                new ApiError(
                    "User recently changed password! Please log in again.",
                    401,
                ),
            );
        }
    }

    // 5) Grant access and attach user to the request
    req.user = currentUser;
    next();
});

// @desc    Permission-based access control (user roles)
// @route   Middleware (applied to role-restricted routes)
// @access  Private
exports.allowedTo = (...roles) => {
    return (req, res, next) => {
        // 1) Ensure the user's role is allowed
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError("You are not allowed to access this route", 403),
            );
        }
        // 2) Role allowed → continue
        next();
    };
};

// @desc    Forgot password (send reset code to email)
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError("There is no user with this email", 404));
    }

    // 2) Generate a random 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3) Hash the reset code before saving (never store plaintext codes)
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    // 4) Save hashed code + 10-min expiry + reset verification flag
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    // 5) Send the reset code by email
    const message = `Hi ${user.name}, we received a request to reset your password. Your reset code is:\n${resetCode}\nEnter this code to reset your password.\nIf you did not request this, please ignore this email and your password will not be changed.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Reset password",
            message,
        });
    } catch (err) {
        // 6) Roll back reset fields if email sending fails
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError("There was an error sending the email", 500));
    }

    res.status(200).json({
        status: "success",
        message: "Reset code sent",
    });
});

// @desc    Verify the reset code sent to the user
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    // 1) Hash the incoming code and look for a matching, unexpired user
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ApiError("Invalid or expired reset code", 400));
    }

    // 2) Mark the reset code as verified
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: "success",
        message: "Reset code verified",
    });
});

// @desc    Reset the user's password
// @route   PUT /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1) Get the user by email (include password for the "same password" check)
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Require that the reset code was verified
    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified", 400));
    }

    // 3) Reject if the new password matches the old one (bcrypt compare)
    const isSamePassword = await bcrypt.compare(
        req.body.newPassword,
        user.password,
    );
    if (isSamePassword) {
        return next(
            new ApiError(
                "New password cannot be the same as the old password",
                400,
            ),
        );
    }

    // 4) Set the new password and clear reset fields
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    // 5) Issue a new token
    const token = generateToken(user._id);
    res.status(200).json({
        status: "success",
        token,
    });
});

// @desc    Rate limiter for auth endpoints
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,                  // 10 requests per IP
    message: "Too many attempts, please try again later",
});