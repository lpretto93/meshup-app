// components/AvatarMenu.js
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AvatarMenu.css";

const AvatarMenu = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="avatar-menu-wrapper">
      <img
        src={user?.photoURL || "/default-avatar.png"}
        alt="avatar"
        className="avatar-image"
      />
      <div className="avatar-dropdown">
        <a href="/profile/edit">Modifica Profilo</a>
        <a href="/mybeat">La tua Dashboard</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AvatarMenu;
