import { useParams } from "react-router-dom";
import './style.css';
function Home() {
  // const navigate = useNavigate();
  //const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { id } = useParams();
  console.log(id);
  // const handleLogout = () => {
  //   localStorage.removeItem("currentUser");
  //   navigate("/login");
  // };
  return (
    <div className="home-container">
      Hello, welcome to our website!!
    </div>
  );
}

export default Home;