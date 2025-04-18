const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Product = require("./Product");

const Checkout = sequelize.define("Checkout", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "userId" },
    onDelete: "CASCADE",
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: "productId" },
    onDelete: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: "checkout",
  timestamps: false,
});

User.hasMany(Checkout, { foreignKey: "userId" });
Product.hasMany(Checkout, { foreignKey: "productId" });
Checkout.belongsTo(User, { foreignKey: "userId" });
Checkout.belongsTo(Product, { foreignKey: "productId" });

module.exports = Checkout;
