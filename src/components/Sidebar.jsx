// src/components/Sidebar.jsx

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { assets } from "../assets/assets";
import axiosInstance from "../api/axiosInstance";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  chats,
  setChats,
  activeChat,
  setActiveChat,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const newChat = async () => {
    try {
      const res = await axiosInstance.post("/chat/new");
      const chat = res.data.chat;

      setChats((prev) => [...prev, { ...chat, messages: [] }]);
      setActiveChat(chat.id);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const deleteChat = async (id) => {
    try {
      await axiosInstance.delete(`/chat/${id}`);

      setChats((prev) => prev.filter((c) => c.id !== id));

      if (activeChat === id) {
        setActiveChat(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`sidebar ${sidebarOpen ? "open" : "closed"} ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="sidebar-top">
        <img
          src={assets.menu_icon}
          className="menu-btn"
          alt="menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {sidebarOpen && (
          <div className="new-chat" onClick={newChat}>
            <img src={assets.plus_icon} alt="new chat" />
            <p>New Chat</p>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div className="sidebar-list">
          <p className="title">RECENT</p>

          {chats.map((chat) => (
            <div
              key={chat.id}
              className="list-item"
              onClick={() => setActiveChat(chat.id)}
              style={{
                background:
                  activeChat === chat.id
                    ? "rgba(100,100,255,0.2)"
                    : "transparent",
                position: "relative",
              }}
            >
              <img src={assets.message_icon} alt="chat" />
              <p>{chat.title || "New Chat"}</p>

              {sidebarOpen && (
                <img
                  src={assets.trash_icon}
                  alt="delete"
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  style={{
                    width: "16px",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="list-item">
          <img src={assets.question_icon} alt="help" />
          {sidebarOpen && <p>Help</p>}
        </div>

        <div className="list-item">
          <img src={assets.history_icon} alt="history" />
          {sidebarOpen && <p>Activity</p>}
        </div>

        <div className="list-item">
          <img src={assets.setting_icon} alt="settings" />
          {sidebarOpen && <p>Settings</p>}
        </div>

        <div className="list-item" onClick={handleLogout}>
          <img src={assets.logout_icon} alt="logout" />
          {sidebarOpen && <p>Logout</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;