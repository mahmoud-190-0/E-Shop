const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SubCategory = require("../models/subCategoryModel");

dotenv.config({ path: "config.env" });


const subCategories = [

  // Electronics
  {
    name: "Smartphones",
    category: "6a90906088b18c6400d919d3"
  },
  {
    name: "Laptops",
    category: "6a90906088b18c6400d919d3"
  },
  {
    name: "Tablets",
    category: "6a90906088b18c6400d919d3"
  },
  {
    name: "Headphones",
    category: "6a90906088b18c6400d919d3"
  },
  {
    name: "Smart Watches",
    category: "6a90906088b18c6400d919d3"
  },


  // Fashion
  {
    name: "Men's Clothing",
    category: "6a90906088b18c6400d919d4"
  },
  {
    name: "Women's Clothing",
    category: "6a90906088b18c6400d919d4"
  },
  {
    name: "Shoes",
    category: "6a90906088b18c6400d919d4"
  },
  {
    name: "Bags",
    category: "6a90906088b18c6400d919d4"
  },
  {
    name: "Accessories",
    category: "6a90906088b18c6400d919d4"
  },


  // Home & Kitchen
  {
    name: "Furniture",
    category: "6a90906088b18c6400d919d5"
  },
  {
    name: "Kitchen Appliances",
    category: "6a90906088b18c6400d919d5"
  },
  {
    name: "Lighting",
    category: "6a90906088b18c6400d919d5"
  },
  {
    name: "Home Decor",
    category: "6a90906088b18c6400d919d5"
  },


  // Beauty & Personal Care
  {
    name: "Skincare",
    category: "6a90906088b18c6400d919d6"
  },
  {
    name: "Hair Care",
    category: "6a90906088b18c6400d919d6"
  },
  {
    name: "Perfumes",
    category: "6a90906088b18c6400d919d6"
  },
  {
    name: "Makeup",
    category: "6a90906088b18c6400d919d6"
  },


  // Sports
  {
    name: "Fitness Equipment",
    category: "6a90906088b18c6400d919d7"
  },
  {
    name: "Sports Wear",
    category: "6a90906088b18c6400d919d7"
  },
  {
    name: "Running",
    category: "6a90906088b18c6400d919d7"
  },
  {
    name: "Outdoor Sports",
    category: "6a90906088b18c6400d919d7"
  },


  // Gaming
  {
    name: "Gaming Consoles",
    category: "6a90906088b18c6400d919d8"
  },
  {
    name: "Video Games",
    category: "6a90906088b18c6400d919d8"
  },
  {
    name: "Gaming Accessories",
    category: "6a90906088b18c6400d919d8"
  },
  {
    name: "PC Gaming",
    category: "6a90906088b18c6400d919d8"
  },


  // Automotive
  {
    name: "Car Accessories",
    category: "6a90906088b18c6400d919d9"
  },
  {
    name: "Car Electronics",
    category: "6a90906088b18c6400d919d9"
  },
  {
    name: "Car Care",
    category: "6a90906088b18c6400d919d9"
  },
  {
    name: "Motorcycle",
    category: "6a90906088b18c6400d919d9"
  },


  // Books
  {
    name: "Programming Books",
    category: "6a90906088b18c6400d919da"
  },
  {
    name: "Business Books",
    category: "6a90906088b18c6400d919da"
  },
  {
    name: "Fiction",
    category: "6a90906088b18c6400d919da"
  },
  {
    name: "Self Development",
    category: "6a90906088b18c6400d919da"
  },


  // Travel
  {
    name: "Luggage",
    category: "6a90906088b18c6400d919dc"
  },
  {
    name: "Travel Accessories",
    category: "6a90906088b18c6400d919dc"
  },
  {
    name: "Camping Gear",
    category: "6a90906088b18c6400d919dc"
  },


  // Health & Fitness
  {
    name: "Supplements",
    category: "6a90906088b18c6400d919dd"
  },
  {
    name: "Fitness Equipment",
    category: "6a90906088b18c6400d919dd"
  },
  {
    name: "Medical Equipment",
    category: "6a90906088b18c6400d919dd"
  },


  // Jewelry & Watches
  {
    name: "Luxury Watches",
    category: "6a90906088b18c6400d919de"
  },
  {
    name: "Gold Jewelry",
    category: "6a90906088b18c6400d919de"
  },
  {
    name: "Rings",
    category: "6a90906088b18c6400d919de"
  },
  {
    name: "Necklaces",
    category: "6a90906088b18c6400d919de"
  }

];


mongoose.connect(process.env.DB_URL)
  .then(async () => {

    await SubCategory.deleteMany();

    await SubCategory.insertMany(subCategories);

    console.log("Sub Categories Imported Successfully ✅");

    process.exit();

  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });