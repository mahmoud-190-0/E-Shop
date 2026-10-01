require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const dbConnection = require("./config/database.js");

// connect DB
dbConnection();
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});