import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ManageUsers from "./components/ManageUsers";
import InfoPage from "./pages/InfoPage";
import Profile from "./pages/Profile";
import ManageTransactions from "./components/ManageTransactions";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- ADMIN ROUTES ---------- */}

        {/* Public admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes under AdminLayout */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Admin pages */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="transactions" element={<ManageTransactions />} />
        </Route>

        {/* ---------- USER ROUTES ---------- */}
        <Route path="/" element={<InfoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/info" element={<InfoPage />} /> */}

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
