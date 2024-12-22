import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CompleteProfile() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location.state?.newUser;
  const handleCompleteProfile = async () => {
    if (!newUser) {
      alert("אין משתמש מחובר");
      return;
    }
    const updatedUser = { ...newUser, fullName, address };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        alert("הפרופיל עודכן בהצלחה");
        navigate("/home");
      } else {
        alert("שגיאה בעדכון פרטי המשתמש");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div>
      {/* <h1>השלם את פרטי המשתמש</h1>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
          <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
          <input
        type="number"
        placeholder="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
          <input
        type="text"
        placeholder="company"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleCompleteProfile}>שמור והשלם</button> */}
    </div>
  );
}
