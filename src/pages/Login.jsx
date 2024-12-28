import "./LoginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch(`http://localhost:3000/users/?username=${username}`);
        let user = await response.json();
        user = user[0];
        if (user.length === 0) {
            alert("User does not exist in the system");
        } else if (user) {
            if (user.website === password) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                navigate(`/home/${user.id}`);
            } else {
                alert("One or more of the details are incorrect");
            }
        }
    };

    return (
        <div className="form-container">
            <h1>Login</h1>
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
            <button className="submit-button" onClick={handleLogin}>Login</button>
            <p>
                אין לך חשבון? <button className="link-button" onClick={() => navigate("/register")}>הרשם כאן</button>
            </p>
        </div>
    );
}

