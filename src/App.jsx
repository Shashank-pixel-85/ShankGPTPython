// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider, { AuthContext } from "./AuthContext";
import ThemeProvider from "./ThemeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { useState, useEffect, useContext } from "react";
import axiosInstance from "./api/axiosInstance";

function AppContent() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useContext(AuthContext);

  // 🟢 FIXED: Normalize chats so Chat.jsx never crashes
  const loadChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/list/all");

      const cleanChats = (res.data.chats || []).map(chat => ({
        id: chat.id,
        title: chat.title,
        messages: []   // load messages only when chat is opened
      }));

      setChats(cleanChats);
    } catch (err) {
      console.error("Error loading chats:", err);
    }
  };

  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="layout">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                setChats={setChats}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
              />

              <Chat
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                setChats={setChats}
                activeChat={activeChat}
              />
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;