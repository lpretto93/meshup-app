// src/pages/ProfileEdit.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../context/UserContext";
import "./ProfileEdit.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { setUserData } = useUser();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [socials, setSocials] = useState({
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatarUrl || user.photoURL || "");
        setSocials(data.socials || {});
      }
    };
    fetchData();
  }, [user]);

  const normalizeSocialUrl = (platform, value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;

    const baseUrls = {
      instagram: "https://instagram.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/in/",
    };

    return baseUrls[platform] + value.replace(/^@/, "");
  };

  const handleSave = async () => {
    if (!user) return;

    const normalizedSocials = {
      instagram: normalizeSocialUrl("instagram", socials.instagram),
      twitter: normalizeSocialUrl("twitter", socials.twitter),
      linkedin: normalizeSocialUrl("linkedin", socials.linkedin),
    };

    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      {
        displayName,
        bio,
        avatarUrl,
        socials: normalizedSocials,
      },
      { merge: true }
    );

    setUserData((prev) => ({
      ...prev,
      displayName,
      bio,
      avatarUrl,
      socials: normalizedSocials,
    }));

    navigate("/mybeat");
  };

  const handleCancel = () => {
    navigate("/mybeat");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatarUrl(downloadURL);
    }
  };

  return (
    <div className="profile-edit">
      <div className="mode-selector">
        <label>
          <input
            type="radio"
            name="theme"
            checked={document.body.classList.contains("light-mode")}
            onChange={() => {
              document.body.classList.remove("dark-mode", "meshup-mode");
              document.body.classList.add("light-mode");
            }}
          />
          Light
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            checked={document.body.classList.contains("dark-mode")}
            onChange={() => {
              document.body.classList.remove("light-mode", "meshup-mode");
              document.body.classList.add("dark-mode");
            }}
          />
          Dark
        </label>
        <label>
          <input
            type="radio"
            name="theme"
            checked={document.body.classList.contains("meshup-mode")}
            onChange={() => {
              document.body.classList.remove("dark-mode", "light-mode");
              document.body.classList.add("meshup-mode");
            }}
          />
          MeshUp
        </label>
      </div>

      <h2>Modifica Profilo</h2>

      <div className="form-group">
        <label>Nome visualizzato</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Es: Mario Rossi"
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Scrivi qualcosa su di te..."
        ></textarea>
      </div>

      <div className="form-group">
        <label>Foto profilo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {avatarUrl && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <img
              src={avatarUrl}
              alt="Anteprima Avatar"
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Instagram</label>
        <input
          type="text"
          value={socials.instagram}
          onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
          placeholder="Link o username"
        />
      </div>

      <div className="form-group">
        <label>Twitter</label>
        <input
          type="text"
          value={socials.twitter}
          onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
          placeholder="Link o username"
        />
      </div>

      <div className="form-group">
        <label>LinkedIn</label>
        <input
          type="text"
          value={socials.linkedin}
          onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
          placeholder="Link al profilo"
        />
      </div>

      <div className="button-group">
        <button onClick={handleSave}>Salva Modifiche</button>
        <button className="cancel-button" onClick={handleCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;