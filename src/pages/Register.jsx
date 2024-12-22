import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
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
    website: "",
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
    password: "",
    passwordVerify: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested object fields
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const updatedData = { ...prev };
        let nested = updatedData;
        for (let i = 0; i < keys.length - 1; i++) {
          nested = nested[keys[i]];
        }
        nested[keys[keys.length - 1]] = value;
        return updatedData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.passwordVerify) {
      alert("הסיסמאות לא תואמות");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users/?username=${formData.username}`
      );
      const user = await response.json();

      if (user.length > 0) {
        alert("שם המשתמש כבר קיים");
      } else {
        const { passwordVerify, ...newUser } = formData; // Remove passwordVerify from the submitted data
        alert("הרשמה בוצעה בהצלחה");
        navigate("/complete-profile", { state: { newUser } });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("שגיאה בתהליך ההרשמה");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <legend>Address</legend>
          <label>
            Street:
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </label>
          <label>
            Suite:
            <input
              type="text"
              name="address.suite"
              value={formData.address.suite}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </label>
          <label>
            Zipcode:
            <input
              type="text"
              name="address.zipcode"
              value={formData.address.zipcode}
              onChange={handleChange}
            />
          </label>
          <fieldset>
            <legend>Geo</legend>
            <label>
              Latitude:
              <input
                type="text"
                name="address.geo.lat"
                value={formData.address.geo.lat}
                onChange={handleChange}
              />
            </label>
            <label>
              Longitude:
              <input
                type="text"
                name="address.geo.lng"
                value={formData.address.geo.lng}
                onChange={handleChange}
              />
            </label>
          </fieldset>
        </fieldset>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Website:
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </label>
        <fieldset>
          <legend>Company</legend>
          <label>
            Company Name:
            <input
              type="text"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Catch Phrase:
            <input
              type="text"
              name="company.catchPhrase"
              value={formData.company.catchPhrase}
              onChange={handleChange}
            />
          </label>
          <label>
            BS:
            <input
              type="text"
              name="company.bs"
              value={formData.company.bs}
              onChange={handleChange}
            />
          </label>
        </fieldset>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Verify Password:
          <input
            type="password"
            name="passwordVerify"
            value={formData.passwordVerify}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
      <p>
        כבר יש לך חשבון? <button onClick={() => navigate("/login")}>התחבר כאן</button>
      </p>
    </div>
  );
}
