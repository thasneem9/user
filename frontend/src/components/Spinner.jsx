 import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = ({ fullScreen = false }) => {
  return (
    <div
      style={{
        height: fullScreen ? "100vh" : "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: fullScreen ? "#ffffff" : "transparent",
      }}
    >
      <ClipLoader color="#4A90E2" size={50} />
    </div>
  );
};

export default Spinner;
