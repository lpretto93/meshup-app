const handleAvatarUpload = async (file) => {
  if (!file || !user) {
    console.warn("⛔ Nessun file o utente non autenticato");
    return;
  }

  try {
    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `avatars/${user.uid}/${fileName}`;
    const imageRef = ref(storage, imagePath);

    console.log("🔼 Inizio upload...");
    console.log("📁 Path:", imageRef.fullPath);
    console.log("👤 UID:", user.uid);
    console.log("📄 File:", file.name);

    await uploadBytes(imageRef, file);
    console.log("✅ Upload completato");

    const url = await getDownloadURL(imageRef);
    console.log("🌍 URL ottenuto:", url);

    await setDoc(doc(db, "users", user.uid), { avatar: url }, { merge: true });

    setAvatar(url);
    setPreview(null);
    alert("🖼 Avatar aggiornato!");
  } catch (error) {
    console.error("❌ Errore durante l'upload dell'avatar:", error);
    alert("Errore nel caricamento dell'immagine profilo");
  }
};