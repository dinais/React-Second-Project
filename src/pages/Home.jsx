import { Link, useNavigate, Outlet } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("currentUser"));
  //const { id } = useParams();
  console.log(id);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div>
      {/* <h1>ברוך הבא, {currentUser?.name}</h1> */}
      <div>
        <Link to={`/home/${id}/todos`}>Todos</Link>
        <Link to={`/home/${id}/posts`}>Posts</Link>
        <Link to={`/home/${id}/albums`}>Albums</Link>
        {/* <Link to={"info"}>Info</Link>    */}
        <button onClick={handleLogout}>Logout</button>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
