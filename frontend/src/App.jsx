import React from "react";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/SideBar";
import RightPanel from "./components/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import FriendsPage from './pages/profile/FriendsPage'
import MessagePage from "./pages/messages/MessagePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./components/subComponents/Spinner";
import ChatPage from "./pages/Chats/ChatPage";
const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/auth/getme");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {authUser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/register"
            element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/friends/:username"
            element={authUser ? <FriendsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={authUser ? <MessagePage /> : <Navigate to="/login" />}
          />
        <Route
            path="/chats"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
        {authUser && <RightPanel />}
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </>
  );
};

export default App;
