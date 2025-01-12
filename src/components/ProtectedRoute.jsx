import { Navigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { userData, setUserData } = useUser();
  const { id: urlId } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const storedUser = userData || JSON.parse(localStorage.getItem("currentUser"));

    if (!storedUser || storedUser.id !== urlId) {
      // הסרת המשתמש
      localStorage.removeItem("currentUser");
      setUserData(null);
      setError(true); // הגדרת מצב השגיאה
    }
  }, [userData, urlId, setUserData]);

  // אם יש שגיאה, נבצע ניווט לעמוד השגיאה
  if (error) {
    return <Navigate to="/error" replace />;
  }

  // אם הכל תקין, נרנדר את ה-children
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
