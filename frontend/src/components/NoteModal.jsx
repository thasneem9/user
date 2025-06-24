// components/NoteModal.jsx
import React from 'react';
import './styles/NoteModal.css';

export default function NoteModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
    </div>
  );
}
