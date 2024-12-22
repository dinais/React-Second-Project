// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function CompleteProfile() {
//   const [fullName, setFullName] = useState("");
//   const [address, setAddress] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const newUser = location.state?.newUser;
//   const handleCompleteProfile = async () => {
//     if (!newUser) {
//       alert("אין משתמש מחובר");
//       return;
//     }
//     const updatedUser = { ...newUser, fullName, address };
//     localStorage.setItem("currentUser", JSON.stringify(updatedUser));
//     try {
//       const response = await fetch("http://localhost:3000/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedUser),
//       });
//       if (response.ok) {
//         alert("הפרופיל עודכן בהצלחה");
//         navigate("/home");
//       } else {
//         alert("שגיאה בעדכון פרטי המשתמש");
//       }
//     } catch (error) {
//       console.error("Error updating user profile:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>השלם את פרטי המשתמש</h1>
//       <input
//         type="text"
//         placeholder="name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//           <input
//         type="text"
//         placeholder="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />
//           <input
//         type="number"
//         placeholder="phone"
//         value={phone}
//         onChange={(e) => setPhone(e.target.value)}
//       />
//           <input
//         type="text"
//         placeholder="company"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />

//       <button onClick={handleCompleteProfile}>שמור והשלם</button>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location.state?.newUser;

  // הגדרת מצב לכל השדות באובייקט אחד
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    lat: "",
    lng: "",
    phone: "",
    website: "",
    companyName: "",
    catchPhrase: "",
    bs: "",
  });

  // פונקציה לעדכון ערכים
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompleteProfile = async () => {
    if (!newUser) {
      alert("אין משתמש מחובר");
      return;
    }

    const updatedUser = {
      id: newUser.id || "1",
      ...formData,
      address: {
        street: formData.street,
        suite: formData.suite,
        city: formData.city,
        zipcode: formData.zipcode,
        geo: { lat: formData.lat, lng: formData.lng },
      },
      company: {
        name: formData.companyName,
        catchPhrase: formData.catchPhrase,
        bs: formData.bs,
      },
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("הפרופיל עודכן בהצלחה");
        navigate(`/home/10`);

      } else {
        alert("שגיאה בעדכון פרטי המשתמש");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const fields = [
    { name: "name", placeholder: "Name" },
    { name: "username", placeholder: "Username" },
    { name: "email", placeholder: "Email" },
    { name: "street", placeholder: "Street" },
    { name: "suite", placeholder: "Suite" },
    { name: "city", placeholder: "City" },
    { name: "zipcode", placeholder: "Zipcode" },
    { name: "lat", placeholder: "Latitude" },
    { name: "lng", placeholder: "Longitude" },
    { name: "phone", placeholder: "Phone" },
    { name: "website", placeholder: "Website" },
    { name: "companyName", placeholder: "Company Name" },
    { name: "catchPhrase", placeholder: "Catch Phrase" },
    { name: "bs", placeholder: "Business Slogan" },
  ];

  return (
    <div>
      <h1>השלם את פרטי המשתמש</h1>
      {fields.map(({ name, placeholder }) => (
        <input
          key={name}
          type="text"
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
        />
      ))}
      <button onClick={handleCompleteProfile}>שמור והשלם</button>
    </div>
  );
}
