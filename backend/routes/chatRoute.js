const express = require("express");
const { Op } = require("sequelize");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const router = express.Router();

router.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  const chats = await ChatMessage.findAll({
    where: { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
    attributes: ["senderId", "receiverId"],
    group: ["senderId", "receiverId"],
  });

  const userIds = new Set();
  chats.forEach(chat => {
    if (chat.senderId !== +userId) userIds.add(chat.senderId);
    if (chat.receiverId !== +userId) userIds.add(chat.receiverId);
  });

  const users = await User.findAll({
    where: { userId: [...userIds] },
    attributes: ["userId", "firstName", "lastName", "username"]
  });

  res.json(users);
});

router.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await ChatMessage.findAll({
    where: {
      [Op.or]: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    },
    order: [["timestamp", "ASC"]],
  });
  res.json(messages);
});

router.post("/send", async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ error: "Missing senderId, receiverId or message" });
  }

  const msg = await ChatMessage.create({ senderId, receiverId, message });
  res.status(201).json(msg);
});


module.exports = router;