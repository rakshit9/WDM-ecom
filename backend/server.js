const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

const { connectDB, sequelize } = require("./config/database");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const chatRoutes = require("./routes/chatRoute");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ Use this for both Express and Socket.IO

const io = new Server(server, {
  cors: {
    origin: "https://rxs2755.uta.cloud/", // ✅ Make sure this matches your frontend
    methods: ["GET", "POST"],
  },
});

// Middleware
// app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("api/uploads", express.static("/tmp/uploads"));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());


// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/chat", chatRoutes);

// Load models to register associations
require("./models/Product");
require("./models/User");
require("./models/Order");
require("./models/Rating");
require("./models/Roles");
require("./models/Favorite");
require("./models/ChatMessage");

// ✅ Real-time chat handlers
io.on("connection", (socket) => {
  console.log("✅ Socket connected");

  socket.on("joinPublicRoom", (roomName) => {
    socket.join(roomName);
    console.log(`Socket joined room: ${roomName}`);
  });

  socket.on("sendMessage", ({ senderId, senderRole, message }) => {
    const payload = {
      senderId,
      senderRole,
      message,
      timestamp: new Date(),
    };

    io.to("user-seller-group").emit("receiveMessage", payload);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });
});

// Start server after DB sync
const PORT = process.env.PORT || 5010;

sequelize
  .sync({ alter : true }) // WARNING: Drops all tables
  .then(() => {
    console.log("✅ DB synced with force (all tables recreated)");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB sync error:", err);
  });