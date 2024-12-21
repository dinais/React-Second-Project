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

    // עדכון המשתמש בפרטים החדשים
    const updatedUser = { ...newUser, fullName, address };

    // שמירה ב-LocalStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // שליחה לשרת המקומי להוסיף את הפרטים החדשים
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
      <h1>השלם את פרטי המשתמש</h1>
      <input
        type="text"
        placeholder="שם מלא"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="text"
        placeholder="כתובת"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleCompleteProfile}>שמור והשלם</button>
    </div>
  );
}
