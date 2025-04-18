// pages/UserChatDashboard.js
import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";

export default function UserChatDashboard() {
  const [conversations, setConversations] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.REACT_APP_BASE_URL}/chat/conversations/${userId}`)
      .then((res) => res.json())
      .then(setConversations)
      .catch((err) => console.error("Conversation load error", err));
  }, [userId]);

  return (
    <div style={{ display: "flex", height: "70vh" , padding: "1rem"}}>
      

      <div style={{ flex: 1 }}>
        {selectedSeller ? (
          <ChatWindow />
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
}
