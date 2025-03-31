import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  // Reindirizza l'utente alla dashboard se è loggato
  useEffect(() => {
    if (user && !loading) {
      navigate("/mybeat");  // Indirizza alla dashboard del profilo
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Errore con Google login:", error);
      alert("⚠️ Errore durante l'accesso con Google.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (error) {
      console.error("Errore con Apple login:", error);
      alert("⚠️ Errore durante l'accesso con Apple.");
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <img
          src="/meshup-logo-banner.png"
          alt="MeshUp Logo"
          className="login-logo"
        />
        <h2>Welcome to MeshUp</h2>
        <p className="subtitle">Connect, share, explore your world 🌍</p>

        <button className="login-btn google" onClick={handleGoogleLogin}>
          <img src="/google.svg" alt="Google logo" className="logo" />
          Sign in with Google
        </button>

        <button className="login-btn apple" onClick={handleAppleLogin}>
          <img src="/apple.svg" alt="Apple logo" className="logo" />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};

export default Login;
