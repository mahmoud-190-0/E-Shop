const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config({ path: "config.env" });

const products = [
    {
        title: "Adjustable Dumbbells",
        description:
            "Premium adjustable dumbbell set with quick-change mechanism, durable cast iron construction, and comfortable ergonomic grip for home workouts",
        quantity: 30,
        sold: 65,
        price: 8999,
        priceAfterDiscount: 7999,
        colors: ["Black", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80",
            "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a913f3c46800243757a510d"],

        ratingsAverage: 4.7,
        ratingsQuantity: 210,
    },
    {
        title: "Resistance Bands Set",
        description:
            "Complete resistance bands set with 5 different resistance levels, non-slip design, and carrying bag for versatile home and gym training",
        quantity: 80,
        sold: 200,
        price: 1999,
        priceAfterDiscount: 1599,
        colors: ["Blue", "Green", "Red", "Yellow"],
        imageCover:
            "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80",
            "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a913f3c46800243757a510d"],

        ratingsAverage: 4.6,
        ratingsQuantity: 350,
    },
    {
        title: "Smart Fitness Scale",
        description:
            "Xiaomi smart fitness scale with body composition analysis, BMI tracking, 13 measurements, and Bluetooth connectivity for health monitoring",
        quantity: 50,
        sold: 120,
        price: 2999,
        priceAfterDiscount: 2499,
        colors: ["White", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1584395630827-4f3e2a3f8e3a?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1584395630827-4f3e2a3f8e3a?w=800&q=80",
            "https://images.unsplash.com/photo-1584395630827-4f3e2a3f8e3a?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a913f3c46800243757a510d"],
        brand: "6a909a1b1b7c2a3e927d5a5b",
        ratingsAverage: 4.8,
        ratingsQuantity: 280,
    },
    {
        title: "Whey Protein Powder",
        description:
            "Premium whey protein powder with 25g protein per serving, low sugar, and delicious chocolate flavor for optimal muscle recovery and growth",
        quantity: 100,
        sold: 300,
        price: 1499,
        priceAfterDiscount: 1299,
        colors: ["Chocolate", "Vanilla", "Strawberry"],
        imageCover:
            "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80",
            "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a9094c35bdfbe7b23ece6cd"],

        ratingsAverage: 4.8,
        ratingsQuantity: 500,
    },
    {
        title: "Creatine Monohydrate",
        description:
            "Pure creatine monohydrate powder for enhanced athletic performance, muscle strength, and power output during intense training sessions",
        quantity: 120,
        sold: 280,
        price: 899,
        priceAfterDiscount: 749,
        colors: ["Unflavored"],
        imageCover:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a9094c35bdfbe7b23ece6cd"],

        ratingsAverage: 4.7,
        ratingsQuantity: 420,
    },
    {
        title: "Energy Protein Bar",
        description:
            "High-protein energy bar with 20g protein, natural ingredients, and delicious flavors for healthy snacking and post-workout recovery",
        quantity: 200,
        sold: 450,
        price: 299,
        priceAfterDiscount: 249,
        colors: ["Chocolate", "Peanut Butter", "Berry"],
        imageCover:
            "https://images.unsplash.com/photo-1622484212667-b6f1f80c76ae?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1622484212667-b6f1f80c76ae?w=800&q=80",
            "https://images.unsplash.com/photo-1622484212667-b6f1f80c76ae?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dd",
        subcategories: ["6a9094c35bdfbe7b23ece6cd"],

        ratingsAverage: 4.5,
        ratingsQuantity: 600,
    },
    {
        title: "Premium Travel Suitcase",
        description:
            "Premium polycarbonate travel suitcase with 360-degree spinner wheels, TSA-approved lock, and durable construction for hassle-free travel",
        quantity: 25,
        sold: 55,
        price: 14999,
        priceAfterDiscount: 12999,
        colors: ["Black", "Silver", "Navy Blue"],
        imageCover:
            "https://images.unsplash.com/photo-1565022536126-8d4b3d1e0e5e?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1565022536126-8d4b3d1e0e5e?w=800&q=80",
            "https://images.unsplash.com/photo-1565022536126-8d4b3d1e0e5e?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6ca"],

        ratingsAverage: 4.8,
        ratingsQuantity: 150,
    },
    {
        title: "Large Luggage 28 Inch",
        description:
            "Spacious 28-inch luggage with lightweight design, durable hard shell, multiple compartments, and smooth-gliding wheels for easy travel",
        quantity: 20,
        sold: 40,
        price: 11999,
        priceAfterDiscount: 10999,
        colors: ["Black", "White", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6ca"],

        ratingsAverage: 4.6,
        ratingsQuantity: 120,
    },
    {
        title: "Lightweight Carry On Bag",
        description:
            "Lightweight carry-on bag with durable construction, multiple compartments, and convenient size for cabin luggage and weekend trips",
        quantity: 45,
        sold: 100,
        price: 4999,
        priceAfterDiscount: 4499,
        colors: ["Black", "Blue", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1546014087-0c85f2b11f43?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1546014087-0c85f2b11f43?w=800&q=80",
            "https://images.unsplash.com/photo-1546014087-0c85f2b11f43?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6ca"],

        ratingsAverage: 4.7,
        ratingsQuantity: 200,
    },
    {
        title: "Travel Backpack",
        description:
            "Nike versatile travel backpack with multiple compartments, padded laptop sleeve, water-resistant material, and comfortable shoulder straps",
        quantity: 70,
        sold: 160,
        price: 3999,
        priceAfterDiscount: 3499,
        colors: ["Black", "Gray", "Navy"],
        imageCover:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cb"],
        brand: "6a909a1b1b7c2a3e927d5a58",
        ratingsAverage: 4.6,
        ratingsQuantity: 300,
    },
    {
        title: "Universal Travel Adapter",
        description:
            "Universal travel adapter with multiple international plugs, USB-C and USB-A ports, and compact design for charging devices worldwide",
        quantity: 80,
        sold: 180,
        price: 2499,
        priceAfterDiscount: 1999,
        colors: ["White", "Black"],
        imageCover:
            "https://images.unsplash.com/photo-1570993492881-11740f8863d5?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1570993492881-11740f8863d5?w=800&q=80",
            "https://images.unsplash.com/photo-1570993492881-11740f8863d5?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cb"],

        ratingsAverage: 4.8,
        ratingsQuantity: 350,
    },
    {
        title: "Neck Travel Pillow",
        description:
            "Premium neck travel pillow with memory foam, ergonomic design, and breathable fabric for comfortable sleep during long flights and journeys",
        quantity: 100,
        sold: 250,
        price: 1499,
        priceAfterDiscount: 1199,
        colors: ["Black", "Gray", "Blue"],
        imageCover:
            "https://images.unsplash.com/photo-1593026125490-f45d45378bb3?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1593026125490-f45d45378bb3?w=800&q=80",
            "https://images.unsplash.com/photo-1593026125490-f45d45378bb3?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cb"],

        ratingsAverage: 4.5,
        ratingsQuantity: 400,
    },
    {
        title: "Outdoor Camping Tent",
        description:
            "Durable outdoor camping tent with waterproof material, easy setup design, and spacious interior for comfortable camping adventures",
        quantity: 15,
        sold: 35,
        price: 7999,
        priceAfterDiscount: 6999,
        colors: ["Green", "Blue", "Orange"],
        imageCover:
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cc"],

        ratingsAverage: 4.7,
        ratingsQuantity: 90,
    },
    {
        title: "Sleeping Bag",
        description:
            "Comfortable sleeping bag with thermal insulation, lightweight design, and compact packing for outdoor camping and backpacking trips",
        quantity: 30,
        sold: 60,
        price: 4999,
        priceAfterDiscount: 4499,
        colors: ["Blue", "Red", "Green"],
        imageCover:
            "https://images.unsplash.com/photo-1524250502761-e17c0b0c8a45?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1524250502761-e17c0b0c8a45?w=800&q=80",
            "https://images.unsplash.com/photo-1524250502761-e17c0b0c8a45?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cc"],

        ratingsAverage: 4.5,
        ratingsQuantity: 130,
    },
    {
        title: "Portable Camping Lamp",
        description:
            "LG portable LED camping lamp with adjustable brightness, long battery life, and durable construction for outdoor adventures and emergencies",
        quantity: 40,
        sold: 85,
        price: 2999,
        priceAfterDiscount: 2499,
        colors: ["Black", "Green"],
        imageCover:
            "https://images.unsplash.com/photo-1507752580268-15a6f576a099?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1507752580268-15a6f576a099?w=800&q=80",
            "https://images.unsplash.com/photo-1507752580268-15a6f576a099?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919dc",
        subcategories: ["6a9094c35bdfbe7b23ece6cc"],
        brand: "6a909a1b1b7c2a3e927d5a5c",
        ratingsAverage: 4.6,
        ratingsQuantity: 170,
    },
    {
        title: "Clean Code",
        description:
            "Essential programming book teaching best practices for writing clean, maintainable, and efficient code with practical examples",
        quantity: 50,
        sold: 120,
        price: 499,
        priceAfterDiscount: 399,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c6"],

        ratingsAverage: 4.9,
        ratingsQuantity: 500,
    },
    {
        title: "JavaScript: The Good Parts",
        description:
            "Classic JavaScript programming book focusing on the best features of the language, essential for every web developer",
        quantity: 45,
        sold: 100,
        price: 399,
        priceAfterDiscount: 329,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c6"],

        ratingsAverage: 4.7,
        ratingsQuantity: 380,
    },
    {
        title: "Node.js Design Patterns",
        description:
            "Comprehensive book on Node.js design patterns, best practices, and advanced techniques for building scalable applications",
        quantity: 35,
        sold: 80,
        price: 599,
        priceAfterDiscount: 499,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c6"],

        ratingsAverage: 4.8,
        ratingsQuantity: 250,
    },
    {
        title: "Rich Dad Poor Dad",
        description:
            "Best-selling personal finance book teaching financial literacy, investment strategies, and building wealth through asset acquisition",
        quantity: 60,
        sold: 150,
        price: 399,
        priceAfterDiscount: 329,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
            "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c7"],

        ratingsAverage: 4.8,
        ratingsQuantity: 600,
    },
    {
        title: "The Lean Startup",
        description:
            "Innovative business book on lean methodology, rapid iteration, and customer development for building successful startups",
        quantity: 40,
        sold: 90,
        price: 449,
        priceAfterDiscount: 379,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c7"],

        ratingsAverage: 4.7,
        ratingsQuantity: 400,
    },
    {
        title: "Zero to One",
        description:
            "The essential business book on innovation, building monopolies, and creating the future by PayPal co-founder Peter Thiel",
        quantity: 35,
        sold: 75,
        price: 399,
        priceAfterDiscount: 329,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919da",
        subcategories: ["6a9094c35bdfbe7b23ece6c7"],

        ratingsAverage: 4.6,
        ratingsQuantity: 320,
    },
    {
        title: "Car Cleaning Kit",
        description:
            "Complete car cleaning kit with premium microfiber cloths, cleaning solutions, and detailing tools for spotless interior and exterior",
        quantity: 60,
        sold: 130,
        price: 2499,
        priceAfterDiscount: 1999,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&q=80",
            "https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c4"],

        ratingsAverage: 4.6,
        ratingsQuantity: 220,
    },
    {
        title: "Car Wax Polish",
        description:
            "Premium car wax polish with long-lasting protection, deep shine, and easy application for professional paint finish results",
        quantity: 80,
        sold: 180,
        price: 1499,
        priceAfterDiscount: 1199,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c4"],

        ratingsAverage: 4.5,
        ratingsQuantity: 280,
    },
    {
        title: "Interior Cleaner Spray",
        description:
            "Professional interior cleaner spray for cars, effective on all surfaces, with pleasant scent and non-greasy formula",
        quantity: 100,
        sold: 220,
        price: 999,
        priceAfterDiscount: 799,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c4"],

        ratingsAverage: 4.4,
        ratingsQuantity: 350,
    },
    {
        title: "Car Dash Camera",
        description:
            "Sony high-definition car dash camera with night vision, motion detection, and loop recording for secure driving and accident evidence",
        quantity: 35,
        sold: 80,
        price: 5999,
        priceAfterDiscount: 5499,
        colors: ["Black"],
        imageCover:
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c3"],
        brand: "6a909a1b1b7c2a3e927d5a5a",
        ratingsAverage: 4.8,
        ratingsQuantity: 190,
    },
    {
        title: "Bluetooth Car Adapter",
        description:
            "Sony Bluetooth car adapter with hands-free calling, wireless music streaming, and dual USB charging ports for convenient driving",
        quantity: 70,
        sold: 160,
        price: 1999,
        priceAfterDiscount: 1599,
        colors: ["Black"],
        imageCover:
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c3"],
        brand: "6a909a1b1b7c2a3e927d5a5a",
        ratingsAverage: 4.7,
        ratingsQuantity: 300,
    },
    {
        title: "Car Phone Charger",
        description:
            "Xiaomi fast car charger with USB-C port, 30W power delivery, and smart chip for safe and efficient charging on the go",
        quantity: 90,
        sold: 200,
        price: 1499,
        priceAfterDiscount: 1199,
        colors: ["Black", "White"],
        imageCover:
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c3"],
        brand: "6a909a1b1b7c2a3e927d5a5b",
        ratingsAverage: 4.6,
        ratingsQuantity: 380,
    },
    {
        title: "Car Phone Holder",
        description:
            "Premium car phone holder with strong suction cup, 360-degree rotation, and universal compatibility for safe phone viewing while driving",
        quantity: 80,
        sold: 180,
        price: 999,
        priceAfterDiscount: 799,
        colors: ["Black"],
        imageCover:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c2"],

        ratingsAverage: 4.5,
        ratingsQuantity: 300,
    },
    {
        title: "Premium Seat Cover",
        description:
            "Luxury seat cover set with premium leather material, comfortable padding, and custom fit for all car models for enhanced interior style",
        quantity: 20,
        sold: 40,
        price: 14999,
        priceAfterDiscount: 12999,
        colors: ["Black", "Beige", "Red"],
        imageCover:
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c2"],

        ratingsAverage: 4.7,
        ratingsQuantity: 100,
    },
    {
        title: "Car Floor Mats",
        description:
            "Premium car floor mats with durable rubber construction, all-weather protection, and custom fit for complete interior coverage",
        quantity: 50,
        sold: 100,
        price: 3999,
        priceAfterDiscount: 3499,
        colors: ["Black", "Gray", "Tan"],
        imageCover:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d9",
        subcategories: ["6a9094c35bdfbe7b23ece6c2"],

        ratingsAverage: 4.5,
        ratingsQuantity: 180,
    },
    {
        title: "Advanced Face Cream",
        description:
            "Dior luxury face cream with anti-aging formula, deep hydration, and skin-revitalizing ingredients for radiant and youthful skin",
        quantity: 30,
        sold: 70,
        price: 11999,
        priceAfterDiscount: 10999,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b6"],
        brand: "6a909a1b1b7c2a3e927d5a5e",
        ratingsAverage: 4.9,
        ratingsQuantity: 200,
    },
    {
        title: "Hydrating Face Cleanser",
        description:
            "Gentle hydrating face cleanser with natural ingredients, effective cleansing, and moisture-locking formula for all skin types",
        quantity: 60,
        sold: 140,
        price: 2499,
        priceAfterDiscount: 1999,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b6"],

        ratingsAverage: 4.6,
        ratingsQuantity: 320,
    },
    {
        title: "Sunscreen SPF 50",
        description:
            "Broad-spectrum sunscreen SPF 50 with lightweight formula, UVA/UVB protection, and non-greasy finish for daily sun defense",
        quantity: 80,
        sold: 190,
        price: 1499,
        priceAfterDiscount: 1199,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b6"],

        ratingsAverage: 4.7,
        ratingsQuantity: 400,
    },
    {
        title: "Repair Hair Shampoo",
        description:
            "Professional repair shampoo with keratin and natural oils for damaged hair restoration, strengthening, and deep nourishment",
        quantity: 70,
        sold: 160,
        price: 1999,
        priceAfterDiscount: 1599,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b7"],

        ratingsAverage: 4.5,
        ratingsQuantity: 280,
    },
    {
        title: "Hair Treatment Mask",
        description:
            "Deep conditioning hair treatment mask with argan oil and shea butter for intense moisture, repair, and silky smooth results",
        quantity: 50,
        sold: 120,
        price: 2499,
        priceAfterDiscount: 1999,
        colors: ["Standard"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b7"],

        ratingsAverage: 4.7,
        ratingsQuantity: 230,
    },
    {
        title: "Professional Hair Dryer",
        description:
            "LG professional hair dryer with ionic technology, multiple heat settings, and powerful airflow for fast drying and smooth styling",
        quantity: 25,
        sold: 55,
        price: 5999,
        priceAfterDiscount: 5499,
        colors: ["Black", "White", "Pink"],
        imageCover:
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b7"],
        brand: "6a909a1b1b7c2a3e927d5a5c",
        ratingsAverage: 4.8,
        ratingsQuantity: 150,
    },
    {
        title: "Matte Lipstick",
        description:
            "Dior long-lasting matte lipstick with rich pigmentation, comfortable texture, and luxurious packaging for elegant makeup looks",
        quantity: 60,
        sold: 150,
        price: 3999,
        priceAfterDiscount: 3499,
        colors: ["Red", "Pink", "Nude", "Burgundy"],
        imageCover:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b9"],
        brand: "6a909a1b1b7c2a3e927d5a5e",
        ratingsAverage: 4.8,
        ratingsQuantity: 350,
    },
    {
        title: "Foundation Makeup",
        description:
            "Dior flawless foundation with buildable coverage, natural finish, and skincare benefits for radiant and even complexion",
        quantity: 40,
        sold: 90,
        price: 4999,
        priceAfterDiscount: 4499,
        colors: ["Light", "Medium", "Tan", "Deep"],
        imageCover:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b9"],
        brand: "6a909a1b1b7c2a3e927d5a5e",
        ratingsAverage: 4.7,
        ratingsQuantity: 250,
    },
    {
        title: "Mascara Volume Pro",
        description:
            "Professional volume mascara with smudge-proof formula, lengthening brush, and intense black pigment for dramatic eye 6a9094c35bdfbe7b23ece6b9",
        quantity: 70,
        sold: 180,
        price: 2999,
        priceAfterDiscount: 2499,
        colors: ["Black"],
        imageCover:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        ],
        category: "6a90906088b18c6400d919d6",
        subcategories: ["6a9094c35bdfbe7b23ece6b9"],

        ratingsAverage: 4.6,
        ratingsQuantity: 400,
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
