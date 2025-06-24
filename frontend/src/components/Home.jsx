import React, { useEffect, useState } from "react";
import './styles/home.css';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
 import UserModal from "../components/UserModal"; 

const Home = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
 

const [showUserModal, setShowUserModal] = useState(false);


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    navigate("/auth");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("/api/posts/myposts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch posts");
        setNotes(data.posts || []);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err.message);
        navigate("/auth");
      });
  }, []);

  const handleCardClick = (post_id) => {
    fetch(`/api/posts/viewPost/${post_id}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
})
      .then((res) => res.json())
      .then((data) => setActiveNote(data.post));
  };
  

  const handleCreatePost = () => {
    fetch("/api/posts/createPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes([data.post, ...notes]);
        setNewPost({ title: "", content: "" });
        setShowCreateModal(false);
      });
  };

  return (
    <>
    <Navbar onLogout={handleLogout} onUserClick={() => setShowUserModal(true)} />
     

      <div className="home-container">
        <h1>WELCOME, {user?.username}</h1>
        <div className="notes-container">
          {notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            notes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={handleCardClick} />
            ))
          )}
        </div>

        {/* ➕ Floating Create Button */}
        <button className="create-button" onClick={() => setShowCreateModal(true)}>＋</button>

        {/* ✍️ Create Post Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Create Post</h2>
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                rows="5"
                placeholder="Content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleCreatePost}>Save</button>
                <button onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

   <NoteModal
  post={activeNote}
  onClose={() => setActiveNote(null)}
  onNoteUpdated={(updated) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updated.id ? updated : note))
    );
    setActiveNote(updated);
  }}
  onNoteDeleted={(deletedId) => {
    setNotes((prev) => prev.filter((note) => note.id !== deletedId));
    setActiveNote(null);
  }}
/>

      </div>
    </>
  );
};

export default Home;
