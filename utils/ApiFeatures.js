const ApiError = require("./ApiError");
const mongoose = require("mongoose");

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }


  filter() {
    const allowedFields = [
      "price",
      "priceAfterDiscount",
      "ratingsAverage",
      "category",
      "brand",
    ];

    const allowedOperators = ["gte", "gt", "lte", "lt"];
    const filters = {};

    for (const [field, value] of Object.entries(this.queryString)) {
      // تجاهل الحقول الخاصة بالبحث والترتيب والصفحات
      if (
        ["page", "sort", "limit", "fields", "keyword"].includes(field)
      ) {
        continue;
      }

      // ارفض أي حقل غير مسموح
      if (!allowedFields.includes(field)) {
        throw new ApiError(`Filtering by '${field}' is not allowed`, 400);
      }

      // امنع Arrays و Objects غير المتوقعة
      if (value === null || Array.isArray(value)) {
        throw new ApiError(`Invalid value for '${field}'`, 400);
      }

      // حقول السعر والتقييم لازم تكون أرقام
      if (
        ["price", "priceAfterDiscount", "ratingsAverage"].includes(field)
      ) {
        const conditions = {};

        if (typeof value === "object") {
          for (const [operator, rawValue] of Object.entries(value)) {
            if (!allowedOperators.includes(operator)) {
              throw new ApiError("Invalid filter operator", 400);
            }

            if (
              typeof rawValue !== "string" ||
              rawValue.trim() === "" ||
              !Number.isFinite(Number(rawValue))
            ) {
              throw new ApiError("Filter value must be numeric", 400);
            }

            conditions[`$${operator}`] = Number(rawValue);
          }

          if (Object.keys(conditions).length === 0) {
            throw new ApiError("Empty filter conditions", 400);
          }

          filters[field] = conditions;
        } else {
          if (
            typeof value !== "string" ||
            value.trim() === "" ||
            !Number.isFinite(Number(value))
          ) {
            throw new ApiError("Filter value must be numeric", 400);
          }

          filters[field] = Number(value);
        }

        continue;
      }

      // category و brand لازم يكونوا MongoDB ObjectId صحيح
      if (
        typeof value !== "string" ||
        !mongoose.isValidObjectId(value)
      ) {
        throw new ApiError(`Invalid ID for '${field}'`, 400);
      }

      filters[field] = value;
    }

    this.mongooseQuery = this.mongooseQuery.find(filters);
    return this;
  }


  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  //search
  search(modelName) {
    const rawKeyword = this.queryString.keyword;

    if (rawKeyword !== undefined) {
      // Validate the input type
      if (
        typeof rawKeyword !== "string" ||
        rawKeyword.trim().length === 0 ||
        rawKeyword.length > 100
      ) {
        throw new Error("Invalid search keyword");
      }

      // Sanitize the keyword
      const keyword = escapeRegex(rawKeyword.trim());

      const regex = { $regex: keyword, $options: "i" };

      let query;

      if (modelName === "Product") {
        query = {
          $or: [
            { title: regex },
            { description: regex },
            { colors: regex },
          ],
        };
      } else {
        query = { name: regex };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
