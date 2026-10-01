const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config({ path: "config.env" });


const products = [
  {
    "title": "iPhone 15 Pro Max",
    "description": "Premium flagship smartphone with titanium design, A17 Pro chip, 48MP camera system, and USB-C port with advanced AI capabilities",
    "quantity": 50,
    "sold": 120,
    "price": 44999,
    "priceAfterDiscount": 42999,
    "colors": ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"],
    "imageCover": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a8"],
    "brand": "6a909a1b1b7c2a3e927d5a56",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 450
  },
  {
    "title": "Galaxy S25 Ultra",
    "description": "Samsung's most advanced smartphone with AI features, 200MP camera, S Pen integration, and premium titanium frame with Gorilla Glass Armor",
    "quantity": 35,
    "sold": 95,
    "price": 41999,
    "priceAfterDiscount": 39999,
    "colors": ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
    "imageCover": "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a8"],
    "brand": "6a909a1b1b7c2a3e927d5a57",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 380
  },
  {
    "title": "Redmi Note 14 Pro",
    "description": "Xiaomi's premium mid-range smartphone featuring 200MP main camera, 5000mAh battery, 120W HyperCharge, and vibrant AMOLED display",
    "quantity": 60,
    "sold": 85,
    "price": 15999,
    "priceAfterDiscount": 14999,
    "colors": ["Obsidian Black", "Arctic White", "Forest Green", "Lavender Purple"],
    "imageCover": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a8"],
    "brand": "6a909a1b1b7c2a3e927d5a5b",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 320
  },
  {
    "title": "MacBook Pro M4",
    "description": "Apple's next-generation professional laptop with M4 chip, 14-inch Liquid Retina XDR display, 24GB memory, and 1TB SSD storage",
    "quantity": 30,
    "sold": 70,
    "price": 89999,
    "priceAfterDiscount": 84999,
    "colors": ["Space Black", "Silver"],
    "imageCover": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a9"],
    "brand": "6a909a1b1b7c2a3e927d5a56",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 300
  },
  {
    "title": "Galaxy Book5 Pro",
    "description": "Samsung's premium laptop with stunning AMOLED display, Intel Core Ultra processor, and seamless ecosystem integration with Galaxy devices",
    "quantity": 25,
    "sold": 45,
    "price": 64999,
    "priceAfterDiscount": 59999,
    "colors": ["Graphite", "Silver"],
    "imageCover": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a9"],
    "brand": "6a909a1b1b7c2a3e927d5a57",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 180
  },
  {
    "title": "LG Gram 16",
    "description": "Ultra-lightweight premium laptop with 16-inch WQXGA display, Intel Evo platform, and all-day battery life for maximum portability",
    "quantity": 20,
    "sold": 35,
    "price": 54999,
    "priceAfterDiscount": 51999,
    "colors": ["Charcoal Gray", "White"],
    "imageCover": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
      "https://images.unsplash.com/photo-1578590044843-6b3c0f4ba453?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6a9"],
    "brand": "6a909a1b1b7c2a3e927d5a5c",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 120
  },
  {
    "title": "iPad Pro M4",
    "description": "Apple's most advanced tablet with M4 chip, Ultra Retina XDR display, and Apple Pencil Pro support for ultimate creativity",
    "quantity": 40,
    "sold": 80,
    "price": 39999,
    "priceAfterDiscount": 37999,
    "colors": ["Space Black", "Silver"],
    "imageCover": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6aa"],
    "brand": "6a909a1b1b7c2a3e927d5a56",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 250
  },
  {
    "title": "Galaxy Tab S10 Ultra",
    "description": "Samsung's flagship tablet with 14.6-inch Dynamic AMOLED 2X display, S Pen included, and powerful multitasking capabilities",
    "quantity": 30,
    "sold": 55,
    "price": 34999,
    "priceAfterDiscount": 32999,
    "colors": ["Graphite", "Silver", "Beige"],
    "imageCover": "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6aa"],
    "brand": "6a909a1b1b7c2a3e927d5a57",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 190
  },
  {
    "title": "Xiaomi Pad 7",
    "description": "Xiaomi's premium tablet with 11.2-inch 3.2K display, Snapdragon 8+ Gen 2, and HyperOS for seamless productivity and entertainment",
    "quantity": 45,
    "sold": 60,
    "price": 18999,
    "priceAfterDiscount": 17999,
    "colors": ["Black", "Gold", "Green"],
    "imageCover": "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6aa"],
    "brand": "6a909a1b1b7c2a3e927d5a5b",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 150
  },
  {
    "title": "AirPods Pro 3",
    "description": "Apple's premium wireless earbuds with Active Noise Cancellation, Spatial Audio, and advanced H3 chip for immersive sound experience",
    "quantity": 80,
    "sold": 200,
    "price": 11999,
    "priceAfterDiscount": 10999,
    "colors": ["White"],
    "imageCover": "https://images.unsplash.com/photo-1600294037681-c80b4bc5a65b?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1600294037681-c80b4bc5a65b?w=800&q=80",
      "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ab"],
    "brand": "6a909a1b1b7c2a3e927d5a56",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 600
  },
  {
    "title": "Galaxy Buds3 Pro",
    "description": "Samsung's premium noise-canceling earbuds with 360 Audio, intelligent noise control, and seamless Galaxy ecosystem integration",
    "quantity": 65,
    "sold": 150,
    "price": 9999,
    "priceAfterDiscount": 8999,
    "colors": ["Graphite", "Silver"],
    "imageCover": "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1600294037681-c80b4bc5a65b?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ab"],
    "brand": "6a909a1b1b7c2a3e927d5a57",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 420
  },
  {
    "title": "Sony WH-1000XM6",
    "description": "Sony's industry-leading noise-canceling 6a9094c35bdfbe7b23ece6ab with exceptional sound quality, adaptive noise cancellation, and all-day comfort",
    "quantity": 40,
    "sold": 110,
    "price": 14999,
    "priceAfterDiscount": 13999,
    "colors": ["Black", "Silver", "Midnight Blue"],
    "imageCover": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ab"],
    "brand": "6a909a1b1b7c2a3e927d5a5a",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 550
  },
  {
    "title": "Apple Watch Ultra 2",
    "description": "Apple's most rugged smartwatch with 49mm titanium case, precision GPS, advanced health sensors, and 3000-nit always-on display",
    "quantity": 35,
    "sold": 85,
    "price": 24999,
    "priceAfterDiscount": 23999,
    "colors": ["Titanium", "Black Titanium"],
    "imageCover": "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ac"],
    "brand": "6a909a1b1b7c2a3e927d5a56",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 280
  },
  {
    "title": "Galaxy Watch 7",
    "description": "Samsung's advanced smartwatch with BioActive sensor, body composition analysis, sleep tracking, and premium circular AMOLED display",
    "quantity": 50,
    "sold": 130,
    "price": 18999,
    "priceAfterDiscount": 17999,
    "colors": ["Graphite", "Silver", "Gold"],
    "imageCover": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=800&q=80",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ac"],
    "brand": "6a909a1b1b7c2a3e927d5a57",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 350
  },
  {
    "title": "Xiaomi Watch S4",
    "description": "Xiaomi's premium smartwatch with 1.43-inch AMOLED display, advanced health monitoring, GPS tracking, and up to 15 days battery life",
    "quantity": 55,
    "sold": 70,
    "price": 7999,
    "priceAfterDiscount": 7499,
    "colors": ["Black", "Silver", "Gold"],
    "imageCover": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d3",
    "subcategories": ["6a9094c35bdfbe7b23ece6ac"],
    "brand": "6a909a1b1b7c2a3e927d5a5b",
    "ratingsAverage": 4.5,
    "ratingsQuantity": 200
  },
  {
    "title": "Men's Sports T-Shirt",
    "description": "Nike Dri-FIT premium athletic t-shirt with moisture-wicking technology, breathable fabric, and ergonomic design for maximum performance",
    "quantity": 100,
    "sold": 250,
    "price": 2499,
    "priceAfterDiscount": 2199,
    "colors": ["Black", "White", "Navy", "Red"],
    "imageCover": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6ad"],
    "brand": "6a909a1b1b7c2a3e927d5a58",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 380
  },
  {
    "title": "Men's Running Jacket",
    "description": "Adidas running jacket with lightweight waterproof fabric, breathable mesh lining, and reflective details for safe night runs",
    "quantity": 45,
    "sold": 90,
    "price": 5999,
    "priceAfterDiscount": 5499,
    "colors": ["Black", "Blue", "Red"],
    "imageCover": "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6ad"],
    "brand": "6a909a1b1b7c2a3e927d5a59",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 200
  },
  {
    "title": "Women's Sports Jacket",
    "description": "Adidas running jacket for women with lightweight waterproof fabric, breathable mesh lining, and reflective details for safe night runs",
    "quantity": 40,
    "sold": 85,
    "price": 5999,
    "priceAfterDiscount": 5499,
    "colors": ["Pink", "Black", "White"],
    "imageCover": "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6ae"],
    "brand": "6a909a1b1b7c2a3e927d5a59",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 180
  },
  {
    "title": "Women's Running Outfit",
    "description": "Nike Dri-FIT women's running outfit with leggings and matching top, breathable fabric, and superior stretch for complete freedom of movement",
    "quantity": 60,
    "sold": 120,
    "price": 7999,
    "priceAfterDiscount": 6999,
    "colors": ["Black", "Pink", "Purple"],
    "imageCover": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6ae"],
    "brand": "6a909a1b1b7c2a3e927d5a58",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 250
  },
  {
    "title": "Air Max Running Shoes",
    "description": "Nike Air Max premium running shoes with responsive cushioning, breathable mesh upper, and iconic visible air unit for ultimate comfort",
    "quantity": 70,
    "sold": 180,
    "price": 7999,
    "priceAfterDiscount": 7499,
    "colors": ["Black/White", "Red/White", "Blue/White"],
    "imageCover": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6af"],
    "brand": "6a909a1b1b7c2a3e927d5a58",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 500
  },
  {
    "title": "Ultraboost Shoes",
    "description": "Adidas Ultraboost with responsive BOOST foam cushioning, adaptive Primeknit upper, and energy-returning technology for endless comfort",
    "quantity": 55,
    "sold": 140,
    "price": 6999,
    "priceAfterDiscount": 6499,
    "colors": ["Black", "White", "Blue"],
    "imageCover": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f2c0?w=800&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6af"],
    "brand": "6a909a1b1b7c2a3e927d5a59",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 420
  },
  {
    "title": "Nike Sports Backpack",
    "description": "Nike versatile sports backpack with multiple compartments, padded laptop sleeve, water-resistant material, and comfortable shoulder straps",
    "quantity": 80,
    "sold": 150,
    "price": 3499,
    "priceAfterDiscount": 2999,
    "colors": ["Black", "Gray", "Navy"],
    "imageCover": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6b0"],
    "brand": "6a909a1b1b7c2a3e927d5a58",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 300
  },
  {
    "title": "Adidas Travel Bag",
    "description": "Adidas durable travel bag with spacious main compartment, front zip pockets, and comfortable handles for effortless travel and sports",
    "quantity": 50,
    "sold": 90,
    "price": 3999,
    "priceAfterDiscount": 3499,
    "colors": ["Black", "Blue", "Red"],
    "imageCover": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d4",
    "subcategories": ["6a9094c35bdfbe7b23ece6b0"],
    "brand": "6a909a1b1b7c2a3e927d5a59",
    "ratingsAverage": 4.5,
    "ratingsQuantity": 220
  },
  {
    "title": "Modern Office Chair",
    "description": "IKEA ergonomic office chair with adjustable height, lumbar support, breathable mesh back, and smooth-rolling casters for comfort",
    "quantity": 40,
    "sold": 70,
    "price": 8999,
    "priceAfterDiscount": 7999,
    "colors": ["Black", "Gray", "White"],
    "imageCover": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b2"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 150
  },
  {
    "title": "Wooden Dining Table",
    "description": "IKEA solid wood dining table with minimalist design, durable construction, and natural finish that complements any interior style",
    "quantity": 25,
    "sold": 45,
    "price": 14999,
    "priceAfterDiscount": 13999,
    "colors": ["Natural Wood", "Dark Wood"],
    "imageCover": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b2"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 120
  },
  {
    "title": "Luxury Sofa Set",
    "description": "IKEA premium sofa set with velvet upholstery, deep seating, and elegant design perfect for modern living room spaces",
    "quantity": 15,
    "sold": 30,
    "price": 24999,
    "priceAfterDiscount": 22999,
    "colors": ["Beige", "Gray", "Blue"],
    "imageCover": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b2"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 80
  },
  {
    "title": "Smart Microwave Oven",
    "description": "LG smart microwave oven with AI cooking, inverter technology, and smart sensor for perfectly cooked meals every time",
    "quantity": 30,
    "sold": 55,
    "price": 8999,
    "priceAfterDiscount": 7999,
    "colors": ["Black", "Silver"],
    "imageCover": "https://images.unsplash.com/photo-1578590044843-6b3c0f4ba453?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1578590044843-6b3c0f4ba453?w=800&q=80",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b3"],
    "brand": "6a909a1b1b7c2a3e927d5a5c",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 170
  },
  {
    "title": "LED Smart Lamp",
    "description": "LG smart LED lamp with adjustable brightness, color temperature control, and app connectivity for perfect ambiance 6a9094c35bdfbe7b23ece6b4",
    "quantity": 60,
    "sold": 100,
    "price": 2999,
    "priceAfterDiscount": 2499,
    "colors": ["White", "Black"],
    "imageCover": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
      "https://images.unsplash.com/photo-1578590044843-6b3c0f4ba453?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b4"],
    "brand": "6a909a1b1b7c2a3e927d5a5c",
    "ratingsAverage": 4.5,
    "ratingsQuantity": 200
  },
  {
    "title": "Modern Ceiling Light",
    "description": "IKEA modern ceiling light with sleek Scandinavian design, energy-efficient LED technology, and warm illumination for any room",
    "quantity": 50,
    "sold": 80,
    "price": 4499,
    "priceAfterDiscount": 3999,
    "colors": ["White", "Black", "Gold"],
    "imageCover": "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b4"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.6,
    "ratingsQuantity": 180
  },
  {
    "title": "Floor Standing Lamp",
    "description": "IKEA elegant floor lamp with adjustable height, dimmable feature, and minimalist design perfect for modern living spaces",
    "quantity": 35,
    "sold": 65,
    "price": 6499,
    "priceAfterDiscount": 5999,
    "colors": ["Black", "White", "Brass"],
    "imageCover": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b4"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.7,
    "ratingsQuantity": 140
  },
  {
    "title": "Wall Decoration Set",
    "description": "IKEA stylish wall decoration set with modern abstract designs, premium quality materials, and easy installation for instant home upgrade",
    "quantity": 70,
    "sold": 120,
    "price": 4999,
    "priceAfterDiscount": 4499,
    "colors": ["Gold", "Black", "White"],
    "imageCover": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b5"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.4,
    "ratingsQuantity": 160
  },
  {
    "title": "Decorative Mirror",
    "description": "IKEA decorative mirror with unique geometric design, premium glass quality, and versatile style for any room decor",
    "quantity": 45,
    "sold": 75,
    "price": 7999,
    "priceAfterDiscount": 6999,
    "colors": ["Gold", "Silver", "Black"],
    "imageCover": "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919d5",
    "subcategories": ["6a9094c35bdfbe7b23ece6b5"],
    "brand": "6a909a1b1b7c2a3e927d5a5d",
    "ratingsAverage": 4.8,
    "ratingsQuantity": 190
  },
  {
    "title": "Rolex Submariner Watch",
    "description": "Rolex Submariner luxury diver's watch with ceramic bezel, automatic movement, 300m water resistance, and iconic design",
    "quantity": 10,
    "sold": 25,
    "price": 149999,
    "priceAfterDiscount": 139999,
    "colors": ["Black", "Blue", "Green"],
    "imageCover": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919de",
    "subcategories": ["6a90a721b7511e4cfd30c115"],
    "brand": "6a909a1b1b7c2a3e927d5a5f",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 120
  },
  {
    "title": "Luxury Gold Watch",
    "description": "Rolex premium gold watch with automatic movement, diamond bezel, leather strap, and exquisite craftsmanship",
    "quantity": 8,
    "sold": 15,
    "price": 199999,
    "priceAfterDiscount": 189999,
    "colors": ["Gold", "Rose Gold"],
    "imageCover": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919de",
    "subcategories": ["6a90a721b7511e4cfd30c115"],
    "brand": "6a909a1b1b7c2a3e927d5a5f",
    "ratingsAverage": 4.9,
    "ratingsQuantity": 80
  },
  {
    "title": "Diamond Necklace",
    "description": "Elegant diamond necklace with 18K gold chain, brilliant-cut diamonds, and timeless design perfect for special occasions",
    "quantity": 12,
    "sold": 20,
    "price": 89999,
    "priceAfterDiscount": 84999,
    "colors": ["Gold", "Silver", "Rose Gold"],
    "imageCover": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1547887538-9f7f2d32df94?w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&q=80"
    ],
    "category": "6a90906088b18c6400d919de",
    "subcategories": ["6a90a733b7511e4cfd30c116"],

    "ratingsAverage": 4.8,
    "ratingsQuantity": 95
  }
];


mongoose.connect(process.env.DB_URL)
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