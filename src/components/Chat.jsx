import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { assets } from "../assets/assets";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../api/axiosInstance";
import sunIcon from "../assets/sun_icon.png";
import moonIcon from "../assets/moon_icon.png";

const Chat = ({
  sidebarOpen,
  setSidebarOpen,
  chats,
  setChats,
  activeChat,
}) => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  const currentChat = chats.find((c) => c.id === activeChat);

  // --------------------------
  // 🚀 Load messages when chat changes
  // --------------------------
  useEffect(() => {
    if (!activeChat) return;

    const loadMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${activeChat}`);
        const messages = res.data.messages || [];

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat ? { ...c, messages } : c
          )
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [activeChat, setChats]);

  // --------------------------
  // 🚀 Auto scroll
  // --------------------------
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, loading]);

  // --------------------------
  // 🚀 SAFETY RETURN (NOW IN CORRECT PLACE!)
  // --------------------------
  if (!currentChat) {
    return (
      <div className={`chat-area ${darkMode ? "dark" : ""}`}>
        <div className="chat-nav">
          <img
            src={assets.menu_icon}
            className="mobile-menu"
            alt="menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <p className="logo">ShankGPT</p>
          <img
            src={darkMode ? moonIcon : sunIcon}
            className="theme-toggle-icon"
            onClick={() => setDarkMode(!darkMode)}
            alt="theme toggle"
          />
        </div>

        <div className="chat-greeting">
          <h1>Hello, <span>Dev</span></h1>
          <p>Create or select a chat to begin.</p>
        </div>
      </div>
    );
  }

  // --------------------------
  // 🚀 Send message
  // --------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );

    const text = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(`/chat/${activeChat}`, {
        message: text,
      });

      const aiMsg = { role: "ai", content: res.data.answer };

      // update title if needed
      const isNewTitle = currentChat.title === "New Chat";
      const updatedTitle = isNewTitle ? text.substring(0, 30) : currentChat.title;

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat
            ? { ...c, title: updatedTitle, messages: [...c.messages, aiMsg] }
            : c
        )
      );
    } catch (err) {
      const fallbackMsg = { role: "ai", content: "⚠️ Server error, try again." };

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat
            ? { ...c, messages: [...c.messages, fallbackMsg] }
            : c
        )
      );
    }

    setLoading(false);
  };

  // --------------------------
  // 🚀 UI Rendering
  // --------------------------
  return (
    <div className={`chat-area ${darkMode ? "dark" : ""}`}>
      <div className="chat-nav">
        <img
          src={assets.menu_icon}
          className="mobile-menu"
          alt="menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <p className="logo">ShankGPT</p>
        <img
          src={darkMode ? moonIcon : sunIcon}
          className="theme-toggle-icon"
          onClick={() => setDarkMode(!darkMode)}
          alt="theme toggle"
        />
      </div>

      {currentChat.messages.length === 0 && !loading && (
        <div className="chat-greeting">
          <h1>Hello, <span>Dev</span></h1>
          <p>How can I help you today?</p>
        </div>
      )}

      <div className="messages">
        {currentChat.messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.role === "ai" ? (
              <ReactMarkdown>{m.content}</ReactMarkdown>
            ) : (
              m.content
            )}
          </div>
        ))}

        {loading && (
          <div className="typing">
            <span></span><span></span><span></span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className={`input-box ${sidebarOpen ? "wide" : "narrow"}`}>
        <input
          placeholder="Enter your prompt here…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <img
          src={assets.send_icon}
          className="send-btn"
          alt="send"
          onClick={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;