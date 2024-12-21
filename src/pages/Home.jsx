import { useNavigate } from "react-router-dom";

function Home() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login"); // מעבר לעמוד הכניסה לאחר יציאה
  };

  return (
    <div>
      <h1>ברוך הבא, {currentUser?.name}</h1>
      <div>
        <button onClick={() => navigate("/info")}>Info</button>
        <button onClick={() => navigate("/todos")}>Todos</button>
        <button onClick={() => navigate("/posts")}>Posts</button>
        <button onClick={() => navigate("/albums")}>Albums</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
