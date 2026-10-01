const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");

// ==================== User Schema ====================

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name required."],
            trim: true,
        },

        // URL-friendly version of the name (auto-generated on save)
        slug: {
            type: String,
            lowercase: true,
        },

        email: {
            type: String,
            lowercase: true,
            required: [true, "Email required."],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },

        phone: {
            type: String,
            // required: [true, "Phone required."],
        },

        profileImage: {
            type: String,
        },

        password: {
            type: String,
            required: [true, "Password required."],
            minlength: [6, "Password must be at least 6 characters."],
            // select: false,
        },

        passwordChangedAt: Date,

        // Forgot-password flow fields
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,

        role: {
            type: String,
            enum: ["user", "manager", "admin"],
            default: "user",
        },

        active: {
            type: Boolean,
            default: true,
        },

        // Products the user saved for later
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        // Saved shipping addresses
        addresses: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                alias: String, // home / work
                details: { type: String, required: true },
                phone: String,
                city: String,
                postalCode: String,
            },
        ],
    },
    { timestamps: true },
);

// ==================== Middleware ====================

// Hash the password before saving (only if it was modified)
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Auto-generate slug when name changes
userSchema.pre("save", async function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
});

module.exports = mongoose.model("User", userSchema);