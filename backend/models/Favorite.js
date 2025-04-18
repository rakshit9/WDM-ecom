const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Product = require("./Product");

const Favorite = sequelize.define("Favorite", {
  favoriteId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
    onDelete: "CASCADE",
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "productId",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "favorites",
  timestamps: false, // Set to true if you want createdAt/updatedAt
});

// Associations
User.hasMany(Favorite, { foreignKey: "userId" });
Product.hasMany(Favorite, { foreignKey: "productId" });

Favorite.belongsTo(User, { foreignKey: "userId" });
Favorite.belongsTo(Product, { foreignKey: "productId" });

module.exports = Favorite;
