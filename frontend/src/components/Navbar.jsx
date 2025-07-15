import React, { Suspense, useState,lazy } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./styles/Navbar.css";

/* import UserModal from "./UserModal"; */
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";


const Navbar = ({ onLogout }) => {
    const UserModal=lazy(()=>import('./UserModal'))

  const [showUserModal, setShowUserModal] = useState(false);
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);

  const handleUserClick = () => setShowUserModal(true);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title">NotesApp</div>
        
        <div className="navbar-icons">
          <FaUser title="Edit Profile" onClick={handleUserClick} size={20} />
          <FaSignOutAlt onClick={onLogout} title="Logout" size={25} />
          
        </div>
     
      </nav>
       

    
      {showUserModal && (
        <Suspense   fallback={<div>Loading modal...</div>}> 
        <UserModal
          user={user}
          onClose={() => setShowUserModal(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
        </Suspense> 
      )}
    </>
  );
};

export default Navbar;
