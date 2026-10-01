const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Product = require('./models/productModel');
const dbUrl = process.env.DB_URL || 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DBNAME + '?retryWrites=true&w=majority';

mongoose.connect(dbUrl)
  .then(async () => {
    const docs = await Product.find({}).select('title').limit(10).lean();
    console.log('TITLE_SAMPLE');
    console.log(JSON.stringify(docs, null, 2));
    const match = await Product.find({ title: { $regex: 'External', $options: 'i' } }).select('title').limit(10).lean();
    console.log('MATCHES');
    console.log(JSON.stringify(match, null, 2));
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
