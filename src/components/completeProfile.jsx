import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UseUser";
import { createResource } from './ServerRequests'

export default function CompleteProfile() {
  const { setUserData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const newUser = location.state?.newUser;
  const [formData, setFormData] = useState({
    name: "",
    username: newUser?.username || "",
    email: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    phone: "",
    website: newUser?.password || "",
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  const handleCompleteProfile = async (event) => {
    event.preventDefault();
    const updatedUser = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      address: {
        street: formData.address.street,
        suite: formData.address.suite,
        city: formData.address.city,
        zipcode: formData.address.zipcode,
        geo: {
          lat: formData.address.geo.lat,
          lng: formData.address.geo.lng,
        },
      },
      phone: formData.phone,
      website: formData.website,
      company: {
        name: formData.company.name,
        catchPhrase: formData.company.catchPhrase,
        bs: formData.company.bs,
      },
    };
    try {
      const addedUser = await createResource("users", updatedUser)
      console.log('User ID:', addedUser.id);
      localStorage.setItem("currentUser", JSON.stringify(addedUser));
      setUserData(addedUser);
      alert("Your profile has updated sucsessfuly");
      navigate(`/users/${addedUser.id}/home`);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };
  const fields = [
    { name: "name", placeholder: "Name", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "address.street", placeholder: "Street", type: "text" },
    { name: "address.suite", placeholder: "Suite", type: "text" },
    { name: "address.city", placeholder: "City", type: "text" },
    { name: "address.zipcode", placeholder: "Zipcode", type: "text" },
    { name: "address.geo.lat", placeholder: "Latitude", type: "text" },
    { name: "address.geo.lng", placeholder: "Longitude", type: "text" },
    { name: "phone", placeholder: "Phone", type: "text" },
    { name: "company.name", placeholder: "Company Name", type: "text" },
    { name: "company.catchPhrase", placeholder: "Catch Phrase", type: "text" },
    { name: "company.bs", placeholder: "Business Slogan", type: "text" },
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setFormData((prev) => {
      let updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  return (
    <form>
      <h1>Complete the user information</h1>
      {fields.map(({ name, placeholder, type }) => (
        <input
          key={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={name.split(".").reduce((acc, key) => acc[key], formData) || ""}
          onChange={handleChange}
        />
      ))}
      <button type="button" onClick={handleCompleteProfile}>
        Save and continue
      </button>
    </form>
  );
}
