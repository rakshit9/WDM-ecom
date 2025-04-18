const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");

const Rating = sequelize.define("Rating", {
  ratingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
    comment: "Rating value between 1 to 5",
  },
  userReview: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "orderId",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "ratings",
  timestamps: true,
});

// Associations
User.hasMany(Rating, { foreignKey: "userId" });
Product.hasMany(Rating, { foreignKey: "productId" });
Order.hasMany(Rating, { foreignKey: "orderId" });

Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(Product, { foreignKey: "productId" });
Rating.belongsTo(Order, { foreignKey: "orderId" });

module.exports = Rating;
