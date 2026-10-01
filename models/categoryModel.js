const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category required."],
      unique: [true, "category must be unique."],
      minlength: [3, "category must be at least 3 characters."],
      maxlength: [32, "category must be at most 32 characters."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      // required: [true, "category image required."]
    },
  },
  { timestamps: true },
);

///////////////////////////////////////////////////////////////////////////////
// image with url
// const setImageUrl = (doc) => {
//   if (doc.image) {
//     doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
//   }
// };
//get one and get all
// categorySchema.post("init", (doc) => {
//   setImageUrl(doc);
// });
//create
// categorySchema.post("save", (doc) => {
//   setImageUrl(doc);
// });
//create model
module.exports = mongoose.model("Category", categorySchema);
