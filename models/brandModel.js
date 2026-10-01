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

//Create model
module.exports = mongoose.model("Brand", brandSchema);
