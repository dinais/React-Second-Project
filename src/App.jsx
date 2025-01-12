import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserProvider";
import Root from "./components/Root";
import Login from "./components/Login";
import Register from "./components/Register.jsx";
import Home from "./components/Home";
import CompleteProfile from "./components/CompleteProfile";
import Posts from "./components/Posts";
import Todos from "./components/Todos";
import Albums from "./components/Albums";
import Photos from './components/Photos';
import SpecificPost from "./components/SpecificPost";
import Comments from "./components/Comments";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorPage from "./components/ErrorPage";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Redirect root path based on user's login status */}
          <Route
            path="/"
            element={<Navigate to={currentUser ? `/users/${currentUser.id}/home` : "/users/home"} />}
          />
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />

          {/* Home route */}
          <Route path="/users/home" element={<Root />}>
            <Route index element={<Home />} />
          </Route>

          {/* Protected user routes */}
          <Route path="/users/:id/*" element={<Root />}>
            <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="todos" element={<ProtectedRoute><Todos /></ProtectedRoute>} />
            <Route path="posts" element={<ProtectedRoute><Posts /></ProtectedRoute>}>
              <Route path=":postId" element={<SpecificPost />} >
                <Route path="comments" element={<Comments />} />
              </Route>
            </Route>
            <Route path="albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />
            <Route path="albums/:albumId/photos" element={<ProtectedRoute><Photos /></ProtectedRoute>} />
          </Route>

          {/* Error page route */}
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
