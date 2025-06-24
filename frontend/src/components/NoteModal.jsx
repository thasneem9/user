import React, { useState,useEffect } from "react";
import "./styles/noteModal.css";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const NoteModal = ({ post, onClose, onNoteUpdated, onNoteDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const token = localStorage.getItem("accessToken");
   useEffect(() => {
  if (post) {
    setTitle(post.title);
    setContent(post.content);
    setIsEditing(false); 
  }
}, [post]);

  if (!post) return null;

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;

    try {
      const res = await fetch("/api/posts/deletePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: post.id }),
      });

      if (!res.ok) throw new Error("Delete failed");
      onNoteDeleted?.(post.id);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/posts/updatePost", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ post_id: post.id, title, content }),
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      onNoteUpdated?.(data.post);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <>
  <input
    className="edit-title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter title"
  />
  <textarea
    className="edit-content"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="Write your note here..."
  />
  <div className="modal-buttons">
    <button onClick={handleSave}>Save</button>
    <button onClick={() => setIsEditing(false)}>Cancel</button>
  </div>
</>

        ) : (
          <>
            <div className="modal-header">
              <h2>{post.title}</h2>
              <div className="modal-icons">
                <FaEdit onClick={() => setIsEditing(true)} title="Edit" />
                <FaTrash onClick={handleDelete} title="Delete" />
                <FaTimes onClick={onClose} title="Close" />
              </div>
            </div>
            <p>{post.content}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteModal;
