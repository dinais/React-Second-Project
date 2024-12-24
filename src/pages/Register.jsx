import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const navigate = useNavigate();
  const handleRegister = async () => {
    if (password !== passwordVerify) {
      alert("הסיסמאות לא תואמות");
      return;
    }
    const response = await fetch(`http://localhost:3000/users/?username=${username}`);
    const user = await response.json();    
    if (user.length > 0 ) {
      alert("שם המשתמש כבר קיים");
    } else {
      const newUser = { username, password };
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