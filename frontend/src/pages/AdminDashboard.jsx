import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const resUsers = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUsers.ok) throw new Error("Failed to fetch users");
        const users = await resUsers.json();
        setUsersCount(users.length);

        const resTrans = await fetch(
          "http://localhost:5000/api/admin/transactions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resTrans.ok) throw new Error("Failed to fetch transactions");
        const transactions = await resTrans.json();
        setTransactionsCount(transactions.length);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;
  if (error) return (
    <div className="dashboard-error">
      <h1>Error</h1>
      <p>Could not load dashboard data: {error}</p>
      <p>You may be logged out. Please <a href="/admin/login">log in again</a>.</p>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card users-card">
          <h2>Total Users</h2>
          <p>{usersCount}</p>
        </div>
        <div className="dashboard-card transactions-card">
          <h2>Total Transactions</h2>
          <p>{transactionsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
