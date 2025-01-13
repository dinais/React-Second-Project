import "./LoginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UseUser";
import { fetchResource } from './ServerRequests'
export default function Login() {
    const { setUserData } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            let user = await fetchResource(username, "users", "username");
            user = user[0];
            if (!user) {
                alert("User does not exist in the system");
            } else {
                if (user.website === password) {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    setUserData(user);
                    navigate(`/users/${user.id}/home`);
                } else {
                    alert("One or more of the details are incorrect");
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
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
                You do not have an account yet? <button className="link-button" onClick={() => navigate("/register")}>Register here!</button>
            </p>
        </div>
    );
}

