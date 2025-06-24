// components/Navbar.jsx
import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './styles/navbar.css';

export default function Navbar({ onLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-title">NotesApp</div>
      <div className="navbar-icons">
        <FaUserCircle className="icon" />
        <FaSignOutAlt className="icon" title="Logout" onClick={onLogout} />
      </div>
    </div>
  );
}
