import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserProvider";
import Root from "./components/Root";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import CompleteProfile from "./components/CompleteProfile";
import Posts from "./components/Posts";
import Todos from "./components/Todos";
import Albums from "./components/Albums";
import Photos from './components/Photos'
import SpecificPost from "./components/SpecificPost";
import Comments from "./components/Comments";
function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? `/users/${currentUser.id}/home` : "/users/home"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/users/home" element={<Root />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/users/:id/*" element={<Root />} >
          <Route path="home" element={<Home />}></Route>
          <Route path="todos" element={<Todos />}></Route>
          <Route path="posts" element={<Posts />}>
            <Route path=":postId" element={<SpecificPost />} >
              <Route path="comments" element={<Comments />} />
            </Route>
          </Route>
          <Route path="albums" element={<Albums />}>
          </Route>
          <Route path="albums/:albumId/photos" element={<Photos />} />
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

