import React, { useEffect, useState,useRef ,lazy,Suspense} from "react";
import './styles/home.css';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import useDebounce from "../hooks/useDebounce.js";

 import NoteSkeleton from "../components/NoteSkeleton"; 
 import { ClipLoader } from 'react-spinners';
import { FaSearch } from 'react-icons/fa';

import { useMemo } from "react";

const Home = () => {

const NoteModal=lazy(()=>import('./NoteModal.jsx'))



  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  


  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [showUserModal, setShowUserModal] = useState(false);
const [noteLoading, setNoteLoading] = useState(false);

const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 300);


  const filteredNotes = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  }, [debouncedQuery, notes]);


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    navigate("/auth");
  };

 const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  setLoading(true);
  fetch(`/api/posts/myposts?page=${page}&limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.posts.length === 0) setHasMore(false);
   setNotes((prev) => {
  const combined = [...prev, ...data.posts];
  const uniquePosts = Array.from(new Map(combined.map(p => [p.id, p])).values());
  return uniquePosts;
});

      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching notes:", err.message);
      setLoading(false);
      navigate("/auth");
    });
}, [page]);
useEffect(() => {
  if (loading || !hasMore) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  if (loaderRef.current) observer.observe(loaderRef.current);

  return () => {
    if (loaderRef.current) observer.unobserve(loaderRef.current);
  };
}, [loading, hasMore]);


const handleCardClick = (post_id) => {
  setNoteLoading(true);
  fetch(`/api/posts/viewPost/${post_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setActiveNote(data.post);
    })
    .catch((err) => console.error("Note fetch error:", err))
    .finally(() => setNoteLoading(false));
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

  return(
    <>
    <Navbar onLogout={handleLogout} onUserClick={() => setShowUserModal(true)} />
     

      <div className="home-container">
  <div className="search-bar">
  <input
    type="text"
    placeholder="Search notes..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <FaSearch className="search-icon" />
</div>

        <div className="notes-container">
        {filteredNotes.length === 0 && !loading ? (
  <p style={{textAlign:'center',margin:'auto', fontSize:'30'}}>No notes found.</p>
) : (
  filteredNotes.map((note) => (
    <NoteCard key={note.id} note={note} onClick={handleCardClick} />
  ))
)}


{/* Show skeletons during both initial and scroll-based loading */}
{loading && (
  <>
    <NoteSkeleton />
    <NoteSkeleton />
    <NoteSkeleton />
  </>
)}


       
        <div ref={loaderRef} />
      </div>



        <button className="create-button" onClick={() => setShowCreateModal(true)}>＋</button>

    
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

 {noteLoading && (
  <div className="note-modal-spinner">
    <ClipLoader size={30} color="#333" />
  </div>
)}

{!noteLoading && activeNote && (
  <Suspense  fallback={<div className="note-modal-spinner"><ClipLoader size={30} color="#333" /></div>}>
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
  </Suspense>
)}


      </div>
   
 
    </>
  );
};

export default Home;
