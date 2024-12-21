import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CompleteProfile from "./pages/CompleteProfile";

function App() {
  const currentUser = localStorage.getItem("currentUser");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? "/home" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

