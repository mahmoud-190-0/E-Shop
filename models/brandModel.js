const mongoose = require("mongoose");
//create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " brand required."],
      unique: true,
      minlength: [2, "brand must be at least 3 characters."],
      maxlength: [32, "brand must be at most 32 characters."],
    },
    description: {
      type: String,
      maxlength: [500, "Description too long"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },

  { timestamps: true },
);

brandSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  count: true,
});

brandSchema.set("toJSON", { virtuals: true });
brandSchema.set("toObject", { virtuals: true });
//Create model
module.exports = mongoose.model("Brand", brandSchema);
