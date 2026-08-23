require("dotenv").config();
console.log("OPENCODE_API_KEY loaded:", process.env.OPENCODE_API_KEY ? "YES" : "NO");
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
