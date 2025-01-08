import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import CompleteProfile from "./components/CompleteProfile";
import Posts from "./components/Posts";
import Todos from "./components/Todos";
import Albums from "./components/Albums";
import SpecificPost from "./components/SpecificPost";
import Comments from "./components/Comments";
function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? `/home/${currentUser}` : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/:id/*" element={<Home />} >
          <Route path="todos" element={<Todos />}></Route>
          <Route path="posts" element={<Posts />}>
            <Route path=":postId" element={<SpecificPost />} >
              <Route path="comments" element={<Comments />} />
            </Route>
          </Route>
          <Route path="albums" element={<Albums />}></Route>
        </Route>
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

