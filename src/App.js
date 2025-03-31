// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProfileEdit from "./pages/ProfileEdit";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./context/UserContext";
import MainLayout from "./components/MainLayout";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode", "meshup-mode");
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  return (
    <div className="app-wrapper">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile/edit"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ProfileEdit />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/mybeat"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
};

export default App;
