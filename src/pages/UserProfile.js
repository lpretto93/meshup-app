import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import "../App.css";

const UserProfile = () => {
  const { uid } = useParams();
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), where("author.uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const userPosts = [];
      let userInfo = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userPosts.push({ id: doc.id, ...data });
        if (!userInfo && data.author) userInfo = data.author;
      });

      setAuthor(userInfo);
      setPosts(userPosts);
    };

    fetchPosts();
  }, [uid]);

  return (
    <>
      <Navbar />
      <div className="app">
        <div className="login-card">
          {author ? (
            <>
              <img
                src={author.photo}
                alt={author.name}
                className="profile-pic"
              />
              <h2>{author.name}</h2>
              <p>UID: {author.uid}</p>

              <hr style={{ margin: "1.5rem 0", opacity: 0.1 }} />
              <h3>Post di {author.name}</h3>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <p>{post.text}</p>
                  </div>
                ))
              ) : (
                <p>Nessun post trovato</p>
              )}
            </>
          ) : (
            <p>Caricamento...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
