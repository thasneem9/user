import React from "react";
import './styles/home.css';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);

      localStorage.removeItem("accessToken");

     navigate("/auth");
  };

  return (
    <div className="home-container">
      <h1>WELCOME, {user?.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
