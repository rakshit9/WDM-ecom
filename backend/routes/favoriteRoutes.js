const express = require("express");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

const router = express.Router();

// ✅ Toggle favorite (add or remove)
router.post("/toggle", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId, productId }
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      return res.json({ message: "Product removed from favorites" });
    }

    const newFavorite = await Favorite.create({ userId, productId });
    res.status(201).json({ message: "Product added to favorites", favorite: newFavorite });

  } catch (error) {
    console.error("❌ Toggle favorite error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all favorite products for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['productId', 'title', 'brand', 'type', 'price', 'images', 'availableQty']
        }
      ]
    });

    const products = favorites.map(fav => fav.Product);

    res.json({ userId, favorites: products });
  } catch (error) {
    console.error("❌ Get favorites error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
