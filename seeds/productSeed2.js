const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config({ path: "config.env" });

const products = [
    {
        title: "PlayStation 5 Game Console",
        description:
            "Sony's next-generation gaming console with ultra-fast SSD, 4K gaming, ray tracing, and DualSense wireless controller for immersive gameplay",
        quantity: 30,
        sold: 85,
        price: 24999,
        priceAfterDiscount: 22999,
        colors: ["White", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6bf"],
        brand: "6a909a1b1b7c2a3e927d5a5a",
        ratingsAverage: 4.9,
        ratingsQuantity: 450,
    },
    {
        title: "FIFA 26 PlayStation Game",
        description:
            "The ultimate football simulation game with realistic graphics, updated teams, immersive gameplay, and exciting new game modes",
        quantity: 100,
        sold: 250,
        price: 1499,
        priceAfterDiscount: 1299,
        colors: ["Standard Edition"],
        imageCover:
            "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
            "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6bf"],

        ratingsAverage: 4.6,
        ratingsQuantity: 380,
    },
    {
        title: "Spider-Man 2 Game",
        description:
            "The highly anticipated Spider-Man sequel with stunning visuals, improved web-swinging mechanics, and an original storyline featuring both Peter Parker and Miles Morales",
        quantity: 80,
        sold: 200,
        price: 1999,
        priceAfterDiscount: 1799,
        colors: ["Standard Edition"],
        imageCover:
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6bf"],

        ratingsAverage: 4.9,
        ratingsQuantity: 520,
    },
    {
        title: "Gaming Keyboard RGB",
        description:
            "High-performance mechanical gaming keyboard with customizable RGB lighting, responsive key switches, and anti-ghosting technology for pro-level gaming",
        quantity: 45,
        sold: 110,
        price: 3499,
        priceAfterDiscount: 2999,
        colors: ["Black", "White"],
        imageCover:
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6c1"],

        ratingsAverage: 4.7,
        ratingsQuantity: 280,
    },
    {
        title: "Gaming Mouse Pro",
        description:
            "Pro-level gaming mouse with high-precision optical sensor, customizable DPI settings, programmable buttons, and comfortable ergonomic design",
        quantity: 60,
        sold: 150,
        price: 2499,
        priceAfterDiscount: 1999,
        colors: ["Black", "White", "RGB"],
        imageCover:
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
            "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6c1"],

        ratingsAverage: 4.8,
        ratingsQuantity: 320,
    },
    {
        title: "High Performance Gaming Monitor",
        description:
            "LG ultra-fast gaming monitor with 240Hz refresh rate, 1ms response time, 4K resolution, and NVIDIA G-Sync for competitive gaming",
        quantity: 25,
        sold: 60,
        price: 14999,
        priceAfterDiscount: 13999,
        colors: ["Black"],
        imageCover:
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d8",
        subcategories: ["6a9094c35bdfbe7b23ece6c1"],
        brand: "6a909a1b1b7c2a3e927d5a5c",
        ratingsAverage: 4.8,
        ratingsQuantity: 190,
    },
    {
        title: "Air Max Running Shoes",
        description:
            "Nike Air Max premium running shoes with responsive cushioning, breathable mesh upper, and iconic visible air unit for ultimate comfort",
        quantity: 70,
        sold: 180,
        price: 7999,
        priceAfterDiscount: 7499,
        colors: ["Black/White", "Red/White", "Blue/White"],
        imageCover:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bc"],
        brand: "6a909a1b1b7c2a3e927d5a58",
        ratingsAverage: 4.9,
        ratingsQuantity: 500,
    },
    {
        title: "Ultraboost Running Shoes",
        description:
            "Adidas Ultraboost with responsive BOOST foam cushioning, adaptive Primeknit upper, and energy-returning technology for endless comfort",
        quantity: 55,
        sold: 140,
        price: 6999,
        priceAfterDiscount: 6499,
        colors: ["Black", "White", "Blue"],
        imageCover:
            "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
            "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bc"],
        brand: "6a909a1b1b7c2a3e927d5a59",
        ratingsAverage: 4.8,
        ratingsQuantity: 420,
    },
    {
        title: "Professional Running Watch",
        description:
            "Advanced GPS running watch with heart rate monitoring, VO2 max tracking, workout analytics, and 14-day battery life",
        quantity: 40,
        sold: 95,
        price: 9999,
        priceAfterDiscount: 8999,
        colors: ["Black", "Silver", "Blue"],
        imageCover:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bc"],

        ratingsAverage: 4.7,
        ratingsQuantity: 260,
    },
    {
        title: "Men's Training T-Shirt",
        description:
            "Nike Dri-FIT premium training t-shirt with moisture-wicking technology, breathable fabric, and ergonomic design for maximum performance",
        quantity: 100,
        sold: 250,
        price: 2499,
        priceAfterDiscount: 2199,
        colors: ["Black", "White", "Navy", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
            "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bb"],
        brand: "6a909a1b1b7c2a3e927d5a58",
        ratingsAverage: 4.6,
        ratingsQuantity: 380,
    },
    {
        title: "Sports Tracksuit",
        description:
            "Adidas premium tracksuit with comfortable fabric, modern design, and versatile style for both sports activities and casual wear",
        quantity: 50,
        sold: 120,
        price: 5999,
        priceAfterDiscount: 5499,
        colors: ["Black", "Blue", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bb"],
        brand: "6a909a1b1b7c2a3e927d5a59",
        ratingsAverage: 4.7,
        ratingsQuantity: 210,
    },
    {
        title: "Athletic Hoodie",
        description:
            "Nike premium athletic hoodie with soft fleece lining, adjustable drawstring hood, and classic design for everyday comfort and style",
        quantity: 80,
        sold: 180,
        price: 3999,
        priceAfterDiscount: 3499,
        colors: ["Black", "Gray", "Navy"],
        imageCover:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d7",
        subcategories: ["6a9094c35bdfbe7b23ece6bb"],
        brand: "6a909a1b1b7c2a3e927d5a58",
        ratingsAverage: 4.8,
        ratingsQuantity: 300,
    },
    {
        title: "Modern Office Chair",
        description:
            "IKEA ergonomic office chair with adjustable height, lumbar support, breathable mesh back, and smooth-rolling casters for comfort",
        quantity: 40,
        sold: 70,
        price: 8999,
        priceAfterDiscount: 7999,
        colors: ["Black", "Gray", "White"],
        imageCover:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b2"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.7,
        ratingsQuantity: 150,
    },
    {
        title: "Wooden Dining Table",
        description:
            "IKEA solid wood dining table with minimalist design, durable construction, and natural finish that complements any interior style",
        quantity: 25,
        sold: 45,
        price: 14999,
        priceAfterDiscount: 13999,
        colors: ["Natural Wood", "Dark Wood"],
        imageCover:
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b2"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.8,
        ratingsQuantity: 120,
    },
    {
        title: "Luxury Sofa Set",
        description:
            "IKEA premium sofa set with velvet upholstery, deep seating, and elegant design perfect for modern living room spaces",
        quantity: 15,
        sold: 30,
        price: 24999,
        priceAfterDiscount: 22999,
        colors: ["Beige", "Gray", "Blue"],
        imageCover:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b2"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.9,
        ratingsQuantity: 80,
    },
    {
        title: "Smart LED Lamp",
        description:
            "LG smart LED lamp with adjustable brightness, color temperature control, and app connectivity for perfect ambiance lighting",
        quantity: 60,
        sold: 100,
        price: 2999,
        priceAfterDiscount: 2499,
        colors: ["White", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b4"],
        brand: "6a909a1b1b7c2a3e927d5a5c",
        ratingsAverage: 4.5,
        ratingsQuantity: 200,
    },
    {
        title: "Modern Ceiling Light",
        description:
            "IKEA modern ceiling light with sleek Scandinavian design, energy-efficient LED technology, and warm illumination for any room",
        quantity: 50,
        sold: 80,
        price: 4499,
        priceAfterDiscount: 3999,
        colors: ["White", "Black", "Gold"],
        imageCover:
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b4"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.6,
        ratingsQuantity: 180,
    },
    {
        title: "Floor Standing Lamp",
        description:
            "IKEA elegant floor lamp with adjustable height, dimmable feature, and minimalist design perfect for modern living spaces",
        quantity: 35,
        sold: 65,
        price: 6499,
        priceAfterDiscount: 5999,
        colors: ["Black", "White", "Brass"],
        imageCover:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b4"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.7,
        ratingsQuantity: 140,
    },
    {
        title: "Decorative Wall Mirror",
        description:
            "IKEA decorative wall mirror with unique geometric design, premium glass quality, and versatile style for any room decor",
        quantity: 45,
        sold: 75,
        price: 7999,
        priceAfterDiscount: 6999,
        colors: ["Gold", "Silver", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
            "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b5"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.8,
        ratingsQuantity: 190,
    },
    {
        title: "Luxury Vase Set",
        description:
            "IKEA elegant vase set with premium ceramic material, modern design, and versatile style for beautiful home decoration",
        quantity: 55,
        sold: 90,
        price: 3499,
        priceAfterDiscount: 2999,
        colors: ["White", "Gold", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
            "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b5"],
        brand: "6a909a1b1b7c2a3e927d5a5d",
        ratingsAverage: 4.5,
        ratingsQuantity: 160,
    },
    {
        title: "Modern Picture Frame",
        description:
            "Elegant modern picture frame with high-quality glass, durable materials, and timeless design perfect for displaying your cherished memories",
        quantity: 100,
        sold: 200,
        price: 999,
        priceAfterDiscount: 799,
        colors: ["Black", "White", "Gold", "Silver"],
        imageCover:
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d5",
        subcategories: ["6a9094c35bdfbe7b23ece6b5"],

        ratingsAverage: 4.4,
        ratingsQuantity: 220,
    },
];

mongoose
    .connect(process.env.DB_URL)
    .then(async () => {
        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log("Products Imported Successfully ✅");

        process.exit();
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
