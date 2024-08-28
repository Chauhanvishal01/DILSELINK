import React from "react";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/SideBar";
import RightPanel from "./components/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <RightPanel />
        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </>
  );
};

export default App;
