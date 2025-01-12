import { Link, useNavigate, Outlet } from "react-router-dom";
import { useState } from 'react'
import { useUser } from "../contexts/useUser";
import './style.css';

export default function Root() {
  const navigate = useNavigate();
 const { userData,setUserData } = useUser();
  const [didGuestPress, setDidGuestPress] = useState(false)
  let id;
  let name
  let isUserLoggedIn = userData && Object.keys(userData).length > 0
    ? true
    : localStorage.getItem("currentUser")
      ? true
      : false;
  if (!userData && localStorage.getItem("currentUser")) {
    setUserData(JSON.parse(localStorage.getItem("currentUser")));
  }
  if (userData) {
    id = userData.id;
    name = userData.name;
  }
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    console.log(userData);
    setUserData(null)
    console.log(userData);
    
    navigate("/login");
  };

  const handleLinkClick = (e) => {
    if (!isUserLoggedIn) {
      e.preventDefault();
      setDidGuestPress(true)
      return;
    }
  };

  return (
    <div className="root-container">
      <nav className="navigation-bar">
        <h3 className="nav-link">
          {isUserLoggedIn
            ? <Link to={`/users/${id}/home`} className="nav-link">Welcome, {name}</Link>
            : "Hi guest"}
        </h3>
        <Link
          to={`/users/${id}/todos`}
          className={`nav-link ${!isUserLoggedIn ? "inactive" : ""}`}
          onClick={(e) => handleLinkClick(e, `/users/${id}/todos`)}
        >
          Todos
        </Link>
        <Link
          to={`/users/${id}/posts`}
          className={`nav-link ${!isUserLoggedIn ? "inactive" : ""}`}
          onClick={(e) => handleLinkClick(e, `/users/${id}/posts`)}
        >
          Posts
        </Link>
        <Link
          to={`/users/${id}/albums`}
          className={`nav-link ${!isUserLoggedIn ? "inactive" : ""}`}
          onClick={(e) => handleLinkClick(e, `/users/${id}/albums`)}
        >
          Albums
        </Link>
        {!isUserLoggedIn && (
          <Link to="/login" className="nav-link"> Login / Signup</Link>
        )}
        {isUserLoggedIn && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </nav>
      <main className="content">
        <Outlet />
        {
          didGuestPress &&
          <div className="center-alert">
            <Link to="/login" className="nav-link">You need to login in order to do actions in our website</Link>
          </div>
        }
      </main>
    </div>
  );
}
