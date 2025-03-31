// src/components/MainLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="main-sidebar">
        <Sidebar />
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default MainLayout;
