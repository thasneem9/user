import React, { useState } from "react";
import "./styles/userModal.css";

const UserModal = ({ onClose, user, onUpdate }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("accessToken");

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username !== user.username ? username : undefined,
          password: password.trim() !== "" ? password : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      setMessage("✅ Updated successfully!");
      onUpdate(data.user);
      setPassword(""); // clear password field
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>

        <label>Username:</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>New Password (optional):</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleUpdate}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default UserModal;
