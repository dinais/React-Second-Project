import "./LoginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== passwordVerify) {
            alert("The passwords do not match");
            return;
        }
        const response = await fetch(`http://localhost:3000/users/?username=${username}`);
        const user = await response.json();
        if (user.length > 0) {
            alert("Username already exists");
        } else {
            const newUser = { username, password };
            navigate("/complete-profile", { state: { newUser } });
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="input-field"
                type="password"
                placeholder="Verify Password"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
            />
            <button className="submit-button" onClick={handleRegister}>Register</button>
            <p>
                You have an account already? <button className="link-button" onClick={() => navigate("/login")}>Login here!</button>
            </p>
        </div>
    );
}
