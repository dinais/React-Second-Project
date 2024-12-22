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
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [suite, setSuite] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [bs, setBs] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location.state?.newUser;

  const handleCompleteProfile = async () => {
    if (!newUser) {
      alert("אין משתמש מחובר");
      return;
    // navigate(`/home/${user.id}`);

    }

    const updatedUser = {
      id: newUser.id || "1",
      name,
      username,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat,
          lng,
        },
      },
      phone,
      website,
      company: {
        name: companyName,
        catchPhrase,
        bs,
      },
    };

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
      <h1>השלם את פרטי המשתמש</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street"
        value={street}
        onChange={(e) => setStreet(e.target.value)}
      />
      <input
        type="text"
        placeholder="Suite"
        value={suite}
        onChange={(e) => setSuite(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Zipcode"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Catch Phrase"
        value={catchPhrase}
        onChange={(e) => setCatchPhrase(e.target.value)}
      />
      <input
        type="text"
        placeholder="Business Slogan"
        value={bs}
        onChange={(e) => setBs(e.target.value)}
      />

      <button onClick={handleCompleteProfile}>שמור והשלם</button>
    </div>
  );
}
}