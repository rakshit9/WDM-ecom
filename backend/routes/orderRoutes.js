const express = require("express");
const Rating = require("../models/Rating");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Checkout = require("../models/Checkout");
const moment = require("moment");

const router = express.Router();




router.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            attributes: ["productId", "title", "brand", "type", "price", "images"],
          },
        ],
        order: [["orderDate", "DESC"]],
      });
  
      // Group orders by date (yyyy-mm-dd)
      const grouped = {};
  
      for (const order of orders) {
        const dateKey = moment(order.orderDate).format("YYYY-MM-DD");
        const price = parseFloat(order.Product.price);
        const quantity = order.quantity;
        const subtotal = +(price * quantity).toFixed(2);
  
        // 🔍 Check for review (if user left one for this product/order)
        const review = await Rating.findOne({
          where: {
            userId,
            orderId: order.orderId,
            productId: order.Product.productId,
          },
          attributes: ["userReview", "rating"],
        });
  
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            orderDate: order.orderDate,
            orders: [],
            totalBeforeTax: 0,
          };
        }
  
        grouped[dateKey].orders.push({
          orderId: order.orderId,
          quantity,
          subtotal,
          product: order.Product,
          review: review?.userReview || null,
          rating: review?.rating || null,
        });
  
        grouped[dateKey].totalBeforeTax += subtotal;
      }
  
      const result = Object.values(grouped).map((group) => {
        const deliveryFee = 5;
        const tax = +(group.totalBeforeTax * 0.085).toFixed(2);
        const grandTotal = +(group.totalBeforeTax + tax + deliveryFee).toFixed(2);
  
        return {
          orderDate: group.orderDate,
          totalOrders: group.orders.length,
          deliveryFee,
          tax,
          grandTotal,
          orders: group.orders,
        };
      });
  
      res.json({
        userId,
        orders: result,
      });
    } catch (err) {
      console.error("❌ Failed to fetch grouped orders:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// GET /orders/confirmation/:userId
router.get("/confirmation/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const checkoutItems = await Checkout.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["productId", "title", "price", "images", "brand"],
        },
      ],
    });

    if (!checkoutItems.length) {
      return res.status(404).json({ message: "No items in checkout" });
    }

    const formatted = checkoutItems.map((item) => {
      const subtotal = parseFloat(item.Product.price) * item.quantity;
      return {
        productId: item.Product.productId,
        title: item.Product.title,
        brand: item.Product.brand,
        image: Array.isArray(item.Product.images) ? item.Product.images[0] : item.Product.images,
        price: item.Product.price,
        quantity: item.quantity,
        subtotal: +subtotal.toFixed(2),
      };
    });

    const totalBeforeTax = formatted.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = +(totalBeforeTax * 0.085).toFixed(2);
    const deliveryFee = 5;
    const grandTotal = +(totalBeforeTax + tax + deliveryFee).toFixed(2);

    res.json({
      userId,
      items: formatted,
      totalBeforeTax: +totalBeforeTax.toFixed(2),
      tax,
      deliveryFee,
      grandTotal,
    });
  } catch (err) {
    console.error("❌ Order confirmation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/review", async (req, res) => {
  try {
    const { userId, productId, orderId, userReview, rating } = req.body;

    if (!userId || !productId || !orderId || !userReview?.trim() || rating == null) {
      return res.status(400).json({ message: "All fields including rating are required" });
    }

    const [user, product, order] = await Promise.all([
      User.findByPk(userId),
      Product.findByPk(productId),
      Order.findByPk(orderId),
    ]);

    if (!user || !product || !order) {
      return res.status(404).json({ message: "Invalid user, product, or order" });
    }

    if (order.userId !== userId || order.productId !== productId) {
      return res.status(403).json({ message: "Unauthorized to review this order" });
    }

    const existing = await Rating.findOne({
      where: { userId, productId, orderId },
    });

    if (existing) {
      return res.status(409).json({ message: "Review already submitted for this product and order" });
    }

    const newReview = await Rating.create({
      userId,
      productId,
      orderId,
      rating,       // ✅ include rating
      userReview,
    });

    res.status(201).json({
      message: "✅ Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("❌ Failed to submit review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/place", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch checkout items
    const checkoutItems = await Checkout.findAll({
      where: { userId },
      include: [Product],
    });

    if (checkoutItems.length === 0) {
      return res.status(400).json({ message: "No items in checkout to place an order" });
    }

    const createdOrders = [];

    for (const item of checkoutItems) {
      const product = item.Product;
      const quantity = item.quantity;

      // Validate stock
      if (product.availableQty < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      // Create order
      const order = await Order.create({
        userId,
        productId: product.productId,
        quantity,
        orderDate: new Date(),
      });

      // Update stock
      product.availableQty -= quantity;
      await product.save();

      createdOrders.push(order);
    }

    // Clear checkout
    await Checkout.destroy({ where: { userId } });

    res.status(201).json({
      message: "✅ Order placed successfully",
      totalOrders: createdOrders.length,
      orders: createdOrders,
    });
  } catch (err) {
    console.error("❌ Order placement error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
  

// router.get("/place", async (req, res) => {
//   try {
//     let userId = 1;
//     let productId = 2;
//     let quantity = 2; // You can also use: req.query.quantity || 1

//     if (!userId || !productId) {
//       return res
//         .status(400)
//         .json({ message: "userId and productId are required" });
//     }

//     // Check if product exists
//     const product = await Product.findByPk(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check stock
//     if (product.availableQty < quantity) {
//       return res.status(400).json({ message: "Insufficient stock available" });
//     }

//     // Create order
//     const newOrder = await Order.create({
//       userId,
//       productId,
//       quantity,
//       orderDate: new Date(),
//     });

//     // Reduce product stock
//     product.availableQty -= quantity;
//     await product.save();

//     res.status(201).json({
//       message: "✅ Order placed successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("❌ Failed to place order:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



module.exports = router;
