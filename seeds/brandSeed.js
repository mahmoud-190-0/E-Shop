const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Brand = requirerequire("../models/brandModel");

dotenv.config({ path: "config.env" });


const brands = [
  {
    name: "Apple",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&q=80"
  },
  {
    name: "Samsung",
    image: "https://images.unsplash.com/photo-1529612700005-e35377bf1415?w=1200&q=80"
  },
  {
    name: "Nike",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
  },
  {
    name: "Adidas",
    image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80"
  },
  {
    name: "Sony",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80"
  },
  {
    name: "Xiaomi",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80"
  },
  {
    name: "L G",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXrmUTCmcI2giZe-zqBbSOfQ5O6IMy0Bqy7Z4pjEY3pw&s=10"
  },
  {
    name: "IKEA",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTALUQdWYx5uG9hHOpjJ8KOYkbTKdgpC5GNWGomQJC_KQ&s=10"
  },
  {
    name: "Dior",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQtv6AFsqXi603up6vBpevEyjp8Q7dBFxd_zRRrrvlFQ&s=10"
  },
  {
    name: "Rolex",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1200&q=80"
  }
];


mongoose.connect(process.env.DB_URL)
  .then(async () => {

    await Brand.deleteMany({});

    await Brand.insertMany(brands);

    console.log("Brands Imported Successfully ✅");

    process.exit();

  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });