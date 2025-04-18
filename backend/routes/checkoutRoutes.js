const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Product = require("../models/Product");
const User = require("../models/User");

// ✅ Add a product to the checkout (or update if it exists)
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ message: "userId, productId, and valid quantity are required" });
    }

    const [user, product] = await Promise.all([
      User.findByPk(userId),
      Product.findByPk(productId),
    ]);

    if (!user || !product) {
      return res.status(404).json({ message: "User or Product not found" });
    }

    const existing = await Checkout.findOne({ where: { userId, productId } });

    let checkoutItem;
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      checkoutItem = existing;
    } else {
      checkoutItem = await Checkout.create({ userId, productId, quantity });
    }

    res.status(201).json({ message: "✅ Product added to checkout", item: checkoutItem });
  } catch (err) {
    console.error("❌ Checkout Add Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all checkout items for a user
router.get("/:userId", async (req, res) => {
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

    const formatted = checkoutItems.map(item => {
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

    const total = formatted.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ userId, total: +total.toFixed(2), items: formatted });
  } catch (err) {
    console.error("❌ Checkout Fetch Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update quantity of product in checkout
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity < 1) {
      return res.status(400).json({ message: "Valid userId, productId, and quantity required" });
    }

    const item = await Checkout.findOne({ where: { userId, productId } });

    if (!item) {
      return res.status(404).json({ message: "Item not found in checkout" });
    }

    item.quantity = quantity;
    await item.save();

    res.json({ message: "✅ Quantity updated", item });
  } catch (err) {
    console.error("❌ Quantity Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete product from checkout
router.delete("/delete", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const item = await Checkout.findOne({ where: { userId, productId } });

    if (!item) {
      return res.status(404).json({ message: "Item not found in checkout" });
    }

    await item.destroy();
    res.json({ message: "🗑️ Item removed from checkout" });
  } catch (err) {
    console.error("❌ Checkout Delete Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
