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
    // Numeric fields — support $gte/$gt/$lte/$lt
    const NUMERIC_FIELDS = [
      "price",
      "priceAfterDiscount",
      "ratingsAverage",
      "quantity",
    ];

    // ObjectId fields — validated as MongoDB ObjectIds
    const OBJECT_ID_FIELDS = ["category", "brand"];

    // Enum fields — value must be one of the allowed list
    const ENUM_FIELDS = {
      role: ["user", "manager", "admin"],
    };

    // Boolean fields — accept "true" / "false" strings
    const BOOLEAN_FIELDS = ["active"];

    const allowedFields = [
      ...NUMERIC_FIELDS,
      ...OBJECT_ID_FIELDS,
      ...Object.keys(ENUM_FIELDS),
      ...BOOLEAN_FIELDS,
    ];

    const allowedOperators = ["gte", "gt", "lte", "lt"];
    const filters = {};

    for (const [field, value] of Object.entries(this.queryString)) {
      // Skip pagination / sort / fields / search params
      if (["page", "sort", "limit", "fields", "keyword"].includes(field)) {
        continue;
      }

      // Reject unknown fields (security: prevent arbitrary queries)
      if (!allowedFields.includes(field)) {
        throw new ApiError(`Filtering by '${field}' is not allowed`, 400);
      }

      // Reject null / array values
      if (value === null || Array.isArray(value)) {
        throw new ApiError(`Invalid value for '${field}'`, 400);
      }

      // ── NUMERIC (supports operators like price[gte]=100) ──
      if (NUMERIC_FIELDS.includes(field)) {
        if (typeof value === "object") {
          const conditions = {};
          for (const [op, raw] of Object.entries(value)) {
            if (!allowedOperators.includes(op)) {
              throw new ApiError("Invalid filter operator", 400);
            }
            if (
              typeof raw !== "string" ||
              raw.trim() === "" ||
              !Number.isFinite(Number(raw))
            ) {
              throw new ApiError("Filter value must be numeric", 400);
            }
            conditions[`$${op}`] = Number(raw);
          }
          if (!Object.keys(conditions).length) {
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

      // ── OBJECT ID (category, brand) ──
      if (OBJECT_ID_FIELDS.includes(field)) {
        if (typeof value !== "string" || !mongoose.isValidObjectId(value)) {
          throw new ApiError(`Invalid ID for '${field}'`, 400);
        }
        filters[field] = value;
        continue;
      }

      // ── ENUM (role) ──
      if (ENUM_FIELDS[field]) {
        if (typeof value !== "string" || !ENUM_FIELDS[field].includes(value)) {
          throw new ApiError(
            `Invalid value for '${field}' — allowed: ${ENUM_FIELDS[field].join(", ")}`,
            400,
          );
        }
        filters[field] = value;
        continue;
      }

      // ── BOOLEAN (active) ──
      if (BOOLEAN_FIELDS.includes(field)) {
        if (value !== "true" && value !== "false") {
          throw new ApiError(
            `Invalid value for '${field}' — must be true or false`,
            400,
          );
        }
        filters[field] = value === "true";
        continue;
      }
    }

    this.mongooseQuery = this.mongooseQuery.find(filters);
    this.filters = filters;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // "price,-name" → "price -name"
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // "name,price" → "name price"
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    const rawKeyword = this.queryString.keyword;

    // Empty / missing keyword → skip search, don't throw
    if (rawKeyword === undefined || rawKeyword === null || rawKeyword === "") {
      return this;
    }

    // Validate keyword type & length
    if (
      typeof rawKeyword !== "string" ||
      rawKeyword.trim().length === 0 ||
      rawKeyword.length > 100
    ) {
      throw new ApiError("Invalid search keyword", 400);
    }

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
    return this;
  }

  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {
      currentPage: page,
      limit,
      numberOfPages: Math.ceil(countDocuments / limit),
      totalResults: countDocuments, // exact count — used by frontend stats
    };

    if (endIndex < countDocuments) pagination.next = page + 1;
    if (skip > 0) pagination.prev = page - 1;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;