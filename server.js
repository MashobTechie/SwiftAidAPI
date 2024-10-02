const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/db");
const PORT = process.env.PORT || 6001;

const app = require("./app");

connectToDB();

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
