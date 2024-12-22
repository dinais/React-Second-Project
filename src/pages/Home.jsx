import { Link, useNavigate,useParams } from "react-router-dom";
function Home() {
    const navigate = useNavigate();
    //const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const {id} = useParams();
    console.log(id);
    const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login"); 
  };

  return (
    <div>
      {/* <h1>ברוך הבא, {currentUser?.name}</h1> */}
      <div>
        <Link to={"/todos"}>Todos</Link>
        <Link to={"/posts"}>Posts</Link>
        <Link to={"/albums"}>Albums</Link>
        <Link to={"/info"}>Info</Link>   
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
