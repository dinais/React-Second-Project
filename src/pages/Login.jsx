import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // הבאת רשימת משתמשים משרת בעת טעינת הקומפוננטה
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.website === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        אין לך חשבון? <button onClick={() => navigate("/register")}>הרשם כאן</button>
      </p>
    </div>
  );
}



