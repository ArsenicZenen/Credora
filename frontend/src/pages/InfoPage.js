import React from "react";
import { useNavigate } from "react-router-dom";
import "./InfoPage.css";
import logo from "../components/images/Black White Minimal Modern Simple Bold Business Mag Logo.png";

function InfoPage() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="info-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left" onClick={() => scrollToSection("home")}>
          <img src={logo} alt="CREDORA Logo" className="nav-logo" />
        </div>
        <div className="nav-right">
          <button onClick={() => scrollToSection("home")}>Home</button>
          <button onClick={() => scrollToSection("about")}>About</button>
          <button onClick={() => scrollToSection("features")}>Features</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
          <button onClick={() => navigate("/login")} className="nav-btn">
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="nav-btn-outline"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1>
            Manage Your <span>Finances</span> Smarter
          </h1>
          <p>
            CREDORA is your personal expense tracker — helping you visualize
            income, monitor spending, and achieve financial balance effortlessly.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Try the Web App
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3514/3514499.png"
            alt="Finance Illustration"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          CREDORA was built with one mission — to simplify financial management
          for everyone. Whether you’re a student, a professional, or a small
          business owner, CREDORA helps you track every rupee and make smarter
          decisions with real-time insights.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose CREDORA?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📊 Analytics Dashboard</h3>
            <p>View clear charts and spending patterns in one place.</p>
          </div>
          <div className="feature-card">
            <h3>💸 Expense Tracking</h3>
            <p>Track income and expenses effortlessly in just a few clicks.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure System</h3>
            <p>Built with modern authentication and data encryption.</p>
          </div>
          <div className="feature-card">
            <h3>☁️ Cloud Sync</h3>
            <p>Access your financial data anytime, anywhere securely.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Have questions or feedback? We’d love to hear from you.</p>
        <div className="contact-buttons">
          <a href="mailto:support@credora.com" className="btn-primary">
            Email Us
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary">
            Visit GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} CREDORA. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default InfoPage;
