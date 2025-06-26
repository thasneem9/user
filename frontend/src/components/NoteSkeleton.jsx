import React from "react";
import "./styles/noteSkeleton.css";

const NoteSkeleton = () => {
  return (
    <div className="note-card skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-content" />
    </div>
  );
};

export default NoteSkeleton;
