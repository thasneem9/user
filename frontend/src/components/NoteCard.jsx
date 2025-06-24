import React from 'react';
import './styles/NoteCard.css';

export default function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={() => onClick(note.id)}>
      <h3>{note.title}</h3>
      <p>{note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}</p>
    </div>
  );
}
