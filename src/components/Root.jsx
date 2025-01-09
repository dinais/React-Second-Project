import { Link, useNavigate, useParams, Outlet } from "react-router-dom";
import './style.css';
export default function Root(){
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { id } = useParams();
  console.log(id);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  return (
    <div className="root-container">
      <nav className="navigation-bar">
      <h3 className="nav-link">ברוך הבא, {currentUser?.name}</h3>
        <Link to={`/users/${id}/todos`} className="nav-link">Todos</Link>
        <Link to={`/users/${id}/posts`} className="nav-link">Posts</Link>
        <Link to={`/users/${id}/albums`} className="nav-link">Albums</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}