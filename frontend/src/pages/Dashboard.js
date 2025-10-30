import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Stats from "./Stats";
import Settings from "./Settings";
import Profile from "./Profile";
import "./Dashboard.css"; // optional for layout
import Transaction from "./Transaction";

function Dashboard() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redirect to login
  };

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user}!</h1>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Nested Routes handled inside Dashboard */}
        <Routes>
          <Route index element={<Stats />} />
          <Route path="expenses" element={<Transaction type="expense" />} />
          <Route path="income" element={<Transaction type="income" />} />
          <Route path="profile" element={<Profile />} />

          {/* <Route path="tranaction" element={<Transaction />} /> */}
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
