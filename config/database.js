const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`DB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`DB Error: ${err.message}`);
    // Retry after 5 seconds instead of crashing
    setTimeout(dbConnection, 5000);
  }
};

module.exports = dbConnection;