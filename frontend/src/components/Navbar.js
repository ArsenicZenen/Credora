import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import DashboardImg from "./images/Dashboard.svg"
const DashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <h1 className="logo" >
        CREDORA
      </h1>
      
      <nav className="nav-links">
         <Link
          to="/dashboard"
          className={isActive("expenses") ? "active" : ""}
        >
        <img src={DashboardImg} alt="Dashboard" className="dashboard-image" /> Dashboard
        </Link>
        <Link
          to="/dashboard/expenses"
          className={isActive("expenses") ? "active" : ""}
        >
          💸 Expenses
        </Link>
        <Link
          to="/dashboard/income"
          className={isActive("income") ? "active" : ""}
        >
          💵 Income
        </Link>
         <Link
          to="/dashboard/profile"
          className={isActive("profile") ? "active" : ""}
        >
        Profile
        </Link>

       
        
        
        
        
      </nav>
    </aside>
  );
};

export default DashboardNavbar;
