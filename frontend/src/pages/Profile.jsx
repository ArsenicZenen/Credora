import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";
import {
  FaMoneyBillWave,
  FaArrowCircleDown,
  FaPiggyBank,
  FaTimes,
} from "react-icons/fa";
import {
  verifyPassword,
  updateUsername,
  updatePassword,
  getUserStats,
} from "../services/api";

function Profile() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [username, setUsername] = useState("JohnDoe");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernamePopupRef = useRef();
  const passwordPopupRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        usernamePopupRef.current &&
        !usernamePopupRef.current.contains(e.target)
      ) {
        setShowUsernamePopup(false);
      }
      if (
        passwordPopupRef.current &&
        !passwordPopupRef.current.contains(e.target)
      ) {
        setShowPasswordPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const stats = await getUserStats(token);
      setIncome(stats.income);
      setExpense(stats.expense);
      setBalance(stats.balance);
    };
    fetchStats();
  }, []);

  const handleUsernameChange = async () => {
    const isVerified = await verifyPassword(password);
    if (!isVerified) {
      alert("Incorrect password!");
      return;
    }
    await updateUsername(newUsername);
    setUsername(newUsername);
    setShowUsernamePopup(false);
    setPassword("");
    setNewUsername("");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("/api/auth/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: password,
        newPassword: newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error updating password");
      return;
    }

    alert("Password updated successfully!");
    setShowPasswordPopup(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const formatAmount = (amount) => {
    if (amount >= 1_000_000_000)
      return (amount / 1_000_000_000).toFixed(1) + "B";
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
    if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
    return amount;
  };

  return (
    <div className="pf-container">
      <h1 className="pf-heading">Profile</h1>

      <div className="pf-header-cards">
        <div className="pf-card pf-income">
          <FaMoneyBillWave size={40} className="pf-icon" />
          <div className="pf-card-content">
            <h3>Income</h3>
            <p>₹{formatAmount(income)}</p>
          </div>
        </div>

        <div className="pf-card pf-expense">
          <FaArrowCircleDown size={40} className="pf-icon" />
          <div className="pf-card-content">
            <h3>Expenses</h3>
            <p>₹{formatAmount(expense)}</p>
          </div>
        </div>

        <div className="pf-card pf-balance">
          <FaPiggyBank size={40} className="pf-icon" />
          <div className="pf-card-content">
            <h3>Balance</h3>
            <p>₹{formatAmount(balance)}</p>
          </div>
        </div>
      </div>

      <div className="pf-actions">
        <h2>Account Settings</h2>
        <button className="pf-btn" onClick={() => setShowUsernamePopup(true)}>
          Change Username
        </button>
        <button className="pf-btn" onClick={() => setShowPasswordPopup(true)}>
          Change Password
        </button>
      </div>

      {showUsernamePopup && (
        <div className="pf-popup-overlay">
          <div className="pf-popup" ref={usernamePopupRef}>
            <FaTimes className="pf-close" onClick={() => setShowUsernamePopup(false)} />
            <h3>Change Username</h3>
            <input
              type="text"
              placeholder="Enter new username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password to verify"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleUsernameChange}>Update Username</button>
          </div>
        </div>
      )}

      {showPasswordPopup && (
        <div className="pf-popup-overlay">
          <div className="pf-popup" ref={passwordPopupRef}>
            <FaTimes className="pf-close" onClick={() => setShowPasswordPopup(false)} />
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Update Password</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
