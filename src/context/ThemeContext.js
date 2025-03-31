// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Crea il contesto per il tema
const ThemeContext = createContext();

// Hook personalizzato per accedere al contesto del tema
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Stato per gestire il tema
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Recupera il tema salvato nel localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    // Salva la preferenza del tema nel localStorage
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    
    // Applica la classe del tema al body
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
