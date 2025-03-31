// AGGIUNTA: caricamento da fotocamera, salvataggio preferiti, notifiche
import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc,
  orderBy,
  arrayUnion,
  arrayRemove,
  setDoc
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./ShotUp.css";

const ShotUp = () => {
  const [user] = useAuthState(auth);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [shots, setShots] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadShot = async () => {
    if (!file || !user) return;
    const fileRef = ref(storage, `shots/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const imageURL = await getDownloadURL(fileRef);

    const newShot = {
      uid: user.uid,
      imageURL,
      caption,
      location,
      tags,
      reactions: { like: 0, fire: 0, wow: 0 },
      comments: [],
      isPublic: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "shots"), newShot);
    setShots(prev => [{ id: docRef.id, ...newShot }, ...prev]);
    setFile(null);
    setPreview(null);
    setCaption("");
    setLocation("");
    setTags([]);

    // Notifica utenti taggati
    tags.forEach(async (uid) => {
      await addDoc(collection(db, "notifications"), {
        to: uid,
        type: "tag",
        from: user.uid,
        createdAt: serverTimestamp(),
        shotId: docRef.id
      });
    });
  };

  const toggleFavorite = async (shotId) => {
    if (!user) return;
    const favRef = doc(db, "users", user.uid);
    const isFav = favorites.includes(shotId);
    const updatedFavs = isFav
      ? favorites.filter(id => id !== shotId)
      : [...favorites, shotId];

    await updateDoc(favRef, { favorites: updatedFavs });
    setFavorites(updatedFavs);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const snap = await getDocs(query(collection(db, "users")));
      const u = snap.docs.find(d => d.id === user.uid)?.data();
      setFavorites(u?.favorites || []);
    };
    loadFavorites();
  }, [user]);

  return (
    <div className="shotup-upload">
      <h2>📸 Nuovo Shot</h2>

      {/* Galleria o Fotocamera */}
      <label className="upload-label">
        📁 Da dispositivo
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <label className="upload-label">
        📷 Scatta foto
        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
      </label>

      {preview && (
        <>
          <img src={preview} alt="preview" className="preview-img" />
          <input
            type="text"
            placeholder="Didascalia"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            type="text"
            placeholder="Luogo"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={uploadShot}>🚀 Pubblica</button>
        </>
      )}

      <h3>🖼️ La tua bacheca</h3>
      <div className="shot-grid">
        {shots.map((shot) => (
          <div key={shot.id} className="shot-card">
            <img src={shot.imageURL} alt="shot" />
            <p>{shot.caption}</p>
            <button onClick={() => toggleFavorite(shot.id)}>
              {favorites.includes(shot.id) ? "💾 Salvato" : "💾 Salva"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShotUp;
