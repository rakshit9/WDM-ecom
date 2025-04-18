const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const Role = sequelize.define("Role", {
  roleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roleType: {
    type: DataTypes.ENUM("admin", "seller", "customer"),
    allowNull: false,
  },
});

// Set up the association: Role belongs to User
Role.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
    unique: true, // Each user can have only one role
  },
  onDelete: "CASCADE",
});

// Optional: If you want reverse association
User.hasOne(Role, {
  foreignKey: "userId",
});

module.exports = Role;
