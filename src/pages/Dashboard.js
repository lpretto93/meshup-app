// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import { QRCodeCanvas } from "qrcode.react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <div className={`dashboard-content ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
      <h1>Benvenuto nella tua Dashboard</h1>

      {userData && (
        <div className="profile-summary">
          {userData.avatarUrl && (
            <img src={userData.avatarUrl} alt="avatar" className="avatar-preview" />
          )}
          {userData.displayName && <h2>{userData.displayName}</h2>}
          {userData.bio && <p>{userData.bio}</p>}

          <div className="social-links">
            {userData.socials?.instagram && (
              <div className="social-item">
                <a href={userData.socials.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={24} />
                </a>
                <QRCodeCanvas value={userData.socials.instagram} size={64} />
              </div>
            )}
            {userData.socials?.twitter && (
              <div className="social-item">
                <a href={userData.socials.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={24} />
                </a>
                <QRCodeCanvas value={userData.socials.twitter} size={64} />
              </div>
            )}
            {userData.socials?.linkedin && (
              <div className="social-item">
                <a href={userData.socials.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} />
                </a>
                <QRCodeCanvas value={userData.socials.linkedin} size={64} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;