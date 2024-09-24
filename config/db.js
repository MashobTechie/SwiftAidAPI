const mongoose = require("mongoose");
let MONGO_URI = process.env.MONGO_URI;
MONGO_URI = MONGO_URI.replace("<password>", process.env.MONGO_PASSWORD);

const connectToDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then((con) => {
      console.log("Database connection successful");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });
};

module.exports = connectToDB;
