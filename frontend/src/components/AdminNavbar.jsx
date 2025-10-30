import React from "react";
import { Link, NavLink ,useNavigate} from "react-router-dom";
import "./AdminNavbar.css";



const AdminNavbar = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };



  return (
    <nav className="admin-navbar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard" end>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/transactions">Manage Transactions</Link>
        </li>
        <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
