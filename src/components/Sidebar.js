// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";
import "./Sidebar.css";

const Sidebar = () => {
  const getBodyClass = () => {
    if (document.body.classList.contains("meshup-mode")) return "meshup-mode";
    if (document.body.classList.contains("dark-mode")) return "dark-mode";
    return "light-mode";
  };

  const [themeClass, setThemeClass] = useState(getBodyClass());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeClass(getBodyClass());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className={`sidebar ${themeClass}`}>
      <div className="top-section">
        <div
          className="avatar-wrapper"
          onMouseEnter={() => setIsProfileMenuOpen(true)}
          onMouseLeave={() => setIsProfileMenuOpen(false)}
        >
          <div className="avatar-section">
            <img
              src={userData?.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <div className={`profile-menu ${isProfileMenuOpen ? "visible" : ""}`}>
            <ul>
              <li><Link to="/profile/edit">Modifica Profilo</Link></li>
              <li><Link to="/profile/share">Condividi Profilo</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>

        <Link to="/mybeat">
          <img src="/meshup-logo-banner.png" alt="MeshUp Logo" className="logo" />
        </Link>

        <div className="nav-section">
          <ul className="nav-links">
            <li><Link to="/mybeat">My Beat</Link></li>
            <li><Link to="/shot">ShotUp</Link></li>
            <li><Link to="/explore">ExploreUp</Link></li>
          </ul>
          <div className="social-links">
            <Link to="https://www.instagram.com">Instagram</Link>
            <Link to="https://www.twitter.com">Twitter</Link>
            <Link to="https://www.linkedin.com">LinkedIn</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
