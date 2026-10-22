const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

// middleware
const globalError = require("./Middleware/errorMidleware.js");
const ApiError = require("./utils/ApiError.js");

// routes
const categoryRoute = require("./routes/categoryRoute.js");
const brandsRoute = require("./routes/brandsRoute.js");
const productRoute = require("./routes/productRoute.js");
const subCategoriesRoute = require("./routes/subCategoriesRoute.js");
const userRoute = require("./routes/userRoute.js");
const authRoute = require("./routes/authRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const wishlistRoute = require("./routes/wishlistRoute.js");
const addressRoute = require("./routes/addressRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const couponRoute = require("./routes/couponRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const app = express();

// ================= Middleware =================
app.use("/api/v1/orders/webhook", express.raw({ type: "application/json" }));
//security
app.use(express.json({ limit: "20kb" }));

app.use(compression());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

app.use(express.static(path.join(__dirname, "uploads")));

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }),
);

app.set("query parser", "extended");

app.use((req, res, next) => {
    const query = req.query;

    // Parameters allowed to have multiple values
    const allowedDuplicates = ["brand", "ratingsAverage", "sold", "ratingsQuantity", "quantity", "category"];

    for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value) && !allowedDuplicates.includes(key)) {
            return next(
                new ApiError(
                    `Duplicate query parameter is not allowed: ${key}`,
                    400
                )
            );
        }
    }

    next();
});

app.use(helmet());

// ================= Routes =================
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoriesRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/brands", brandsRoute);

app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/addresses", addressRoute);

app.use("/api/v1/orders", orderRoute);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);

// ================= 404 Handler =================
app.all("/*splat", (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// ================= Global Error =================
app.use(globalError);

module.exports = app;