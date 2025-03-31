// MyBeat.js
import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import "./MyBeat.css";

const MyBeat = ({ userData }) => {  // <--- aggiungi prop userData
  const [user] = useAuthState(auth);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPosts(fetched);
    });
    return () => unsubscribe();
  }, [user]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    let imageUrl = null;
    if (image) {
      const imageRef = ref(storage, `postImages/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "posts"), {
      uid: user.uid,
      username: userData.displayName || user.displayName,
      avatar: userData.avatar || user.photoURL,
      content,
      imageUrl,
      createdAt: serverTimestamp(),
    });

    setContent("");
    setImage(null);
  };

  const handleDelete = async (postId, imageUrl) => {
    await deleteDoc(doc(db, "posts", postId));
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(() => {});
    }
  };

  return (
    <div className="mybeat-container">
      <header className="mybeat-header">
        <img
          src={userData?.avatar || "/default-avatar.png"}  // <-- Importante
          alt="avatar"
          className="mybeat-avatar"
        />
        <div>
          <h2>{userData?.displayName || user.displayName || "User"}</h2>
          <p>Welcome to your Beat 🎧</p>
        </div>
      </header>

      <form onSubmit={handlePost} className="mybeat-form">
        <textarea placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} rows="3"/>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        <button type="submit">Post Vibe</button>
      </form>

      <section className="mybeat-posts">
        {posts.length === 0 ? (
          <p className="no-posts">You haven’t posted anything yet.</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="vibe-card">
              <div className="vibe-header">
                <img src={post.avatar} alt="avatar" />
                <div>
                  <strong>{post.username}</strong>
                  <p>{post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Just now"}</p>
                </div>
              </div>
              <p>{post.content}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="post" className="vibe-image" />}
              <button onClick={() => handleDelete(post.id, post.imageUrl)}>🗑 Delete</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default MyBeat;
