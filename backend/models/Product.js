const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User"); // 👈 Required for association

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    availableQty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Prevent negative stock
      },
      comment: "How many items are currently in stock",
    },
    images: {
      type: DataTypes.TEXT, // Stored as a JSON string
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("images");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
    },
    productCreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// Association
User.hasMany(Product, { foreignKey: "productCreatedBy" });
Product.belongsTo(User, { foreignKey: "productCreatedBy" });

module.exports = Product;
