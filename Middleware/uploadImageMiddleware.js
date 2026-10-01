const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    const ext = path.extname(file.originalname).toLowerCase();
    //! added
    if (!file.mimetype.startsWith("image/") || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };
  /*############################*/
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  return upload;
};
//#############################

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
exports.uploadMixImage = (arrayOfImages) =>
  multerOptions().fields(arrayOfImages);
