import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
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

  const handleRegister = async () => {
    if (password !== passwordVerify) {
      alert("הסיסמאות לא תואמות");
      return;
    }

    const userExists = users.some((u) => u.username === username);
    if (userExists) {
      alert("שם המשתמש כבר קיים");
    } else {
      // יצירת משתמש חדש
      const newUser = { username, password };

      // נווט לעמוד להשלמת פרטי המשתמש
      navigate("/complete-profile", { state: { newUser } });
    }
  };

  return (
    <div>
      <h1>Register</h1>
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
      <input
        type="password"
        placeholder="Verify Password"
        value={passwordVerify}
        onChange={(e) => setPasswordVerify(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        כבר יש לך חשבון? <button onClick={() => navigate("/login")}>התחבר כאן</button>
      </p>
    </div>
  );
}
