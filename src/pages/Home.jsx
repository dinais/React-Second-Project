import { Link, useNavigate, useParams, Outlet } from "react-router-dom";
import './todos.css'
function Home() {
  const navigate = useNavigate();
  //const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { id } = useParams();
  console.log(id);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* <header className="header">
       <h1>ברוך הבא, {currentUser?.name}</h1>
   </header> */}
      <nav className="navigation-bar">
        <Link to={`/home/${id}/todos`} className="nav-link">Todos</Link>
        <Link to={`/home/${id}/posts`} className="nav-link">Posts</Link>
        <Link to={`/home/${id}/albums`} className="nav-link">Albums</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;