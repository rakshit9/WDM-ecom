const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// const connectDB = require("./config/db");
const { connectDB, sequelize } = require("./config/database");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

dotenv.config();
connectDB();

const app = express();

app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads"))); // serve uploaded images
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/favorites", favoriteRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);


const PORT = process.env.PORT || 5000;

require("./models/Product");
require("./models/User");
require("./models/Order");
require("./models/Rating");
require("./models/Roles");
require("./models/Favorite");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB sync error:", err);
  });
