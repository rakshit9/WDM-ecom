import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaUser, FaUserTie } from "react-icons/fa";

const socket = io(process.env.REACT_APP_SOCKET_SERVER || "http://localhost:5010");
const CHAT_KEY = "groupChatMessages";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const senderId = currentUser?.id;
  const senderRole = currentUser?.role || (currentUser?.isAdmin ? "seller" : "customer");

  // 🟡 Load messages from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
    setMessages(stored);
  }, []);

  // 🟢 Setup socket events
  useEffect(() => {
    if (!senderId || !senderRole) return;

    socket.emit("joinPublicRoom", "user-seller-group");

    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === senderId) return;

      setMessages((prevMessages) => {
        const updated = [...prevMessages, msg];
        localStorage.setItem(CHAT_KEY, JSON.stringify(updated)); // ✅ Fix refresh loss
        return updated;
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, senderRole]);

  // 🔁 Store new messages into localStorage
  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      senderId,
      senderRole,
      message: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const clearChat = () => {
    localStorage.removeItem(CHAT_KEY);
    setMessages([]);
  };

  const getIcon = (role) => {
    return role === "seller" ? <FaUserTie size={24} color="#4caf50" /> : <FaUser size={24} color="#ff9800" />;
  };

  if (!senderId || !senderRole) {
    return <div>Please log in to use chat.</div>;
  }

  return (
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3 style={{ color: "#fff" }}>Group Chat</h3>
        <button
          onClick={clearChat}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "0.3rem 0.8rem",
            cursor: "pointer",
          }}
        >
          Clear Chat
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          border: "1px solid #333",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#fff",
        }}
      >
        {messages.map((msg, index) => {
          const isSelf = msg.senderId === senderId;
          const isSeller = msg.senderRole === "seller";
          const bubbleColor = isSelf
            ? "#007bff"
            : isSeller
            ? "#4caf50"
            : "#ff9800";

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: isSelf ? "row-reverse" : "row",
                alignItems: "flex-start",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  margin: "0 0.5rem",
                }}
              >
                {getIcon(msg.senderRole)}
              </div>
              <div
                style={{
                  backgroundColor: bubbleColor,
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  maxWidth: "65%",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.15)",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>{msg.senderRole}:</strong>{" "}
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "0.75rem 1.25rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
