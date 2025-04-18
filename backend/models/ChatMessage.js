const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const ChatMessage = sequelize.define("ChatMessage", {
  chatId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "userId" },
    onDelete: "CASCADE",
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "userId" },
    onDelete: "CASCADE",
  },
  message: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "chat_messages",
  timestamps: false,
});

User.hasMany(ChatMessage, { foreignKey: "senderId", as: "sentMessages" });
User.hasMany(ChatMessage, { foreignKey: "receiverId", as: "receivedMessages" });
ChatMessage.belongsTo(User, { foreignKey: "senderId", as: "sender" });
ChatMessage.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

module.exports = ChatMessage;