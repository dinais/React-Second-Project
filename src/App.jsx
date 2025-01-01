import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import CompleteProfile from "./components/completeProfile";
import Posts from "./components/posts";
import Todos from "./components/todos";
import Albums from "./components/albums";
import SpecificPost from "./components/specificPost";

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
            <Route path=":postId" element={<SpecificPost />} /></Route>
          <Route path="albums" element={<Albums />}></Route>
        </Route>
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

