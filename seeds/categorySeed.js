

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const category = require("../models/categoryModel");

dotenv.config({ path: "config.env" });


const categories = [
  {
    name: 'Electronics',
    //
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80'
  },
  {
    name: 'Fashion',
    //
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80'
  },
  {
    name: 'Home & Kitchen',
    //
    image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&q=80'
  },
  {
    name: 'Beauty & Personal Care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80'
  },
  {
    name: 'Sports',
    //
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80'
  },
  {
    name: 'Gaming',
    //
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&q=80'
  },
  {
    name: 'Automotive',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80'
  },
  {
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80'
  },
  {
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80'
  },

  {
    name: 'Health & Fitness',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkDKBl5l4LDTLo6LhfKA0YgYiVOIT4v8VT5e079aSYTA&s=10'
  },
  {
    name: 'Jewelry & Watches',
    //
    image: 'https://images.pexels.com/photos/13155695/pexels-photo-13155695.jpeg'
  }
];

mongoose.connect(process.env.DB_URL)
  .then(async () => {

    await category.deleteMany({});

    await category.insertMany(categories);

    console.log("categories Imported Successfully ✅");

    process.exit();

  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });