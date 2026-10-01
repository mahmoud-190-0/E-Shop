const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " category required."],
      trim: true,
      unique: [true, "subCategory must be unique."],
      minlength: [2, "subCategory must be at least 2 characters."],
      maxlength: [32, "subCategory must be at most 32 characters."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
    ref: "Category",
      required: [true, "subCategory must refer to parent category"],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model(`SubCategory`, subCategorySchema);
