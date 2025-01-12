import { Link } from "react-router-dom";
import './ErrorPage.css'; // להוספת עיצוב מותאם אישית

export default function ErrorPage() {
  return (
    <div className="error-container">
      <h1>Error 404</h1>
      <p>The ID you entered is not valid, and you have been logged out for security reasons.</p>
      <Link to="/users/home" className="home-link">Go back to Home</Link>
    </div>
  );
}
