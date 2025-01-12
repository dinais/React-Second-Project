import { useUser } from "../contexts/useUser";
import {FaTimes } from "react-icons/fa";
import {PropTypes}from"prop-types"
export default function Info(props) {
  const { userData } = useUser();
  const storedUser = userData || JSON.parse(localStorage.getItem("currentUser"));
const{setShowProfileModal}=props;
const handleClose = () => {
    setShowProfileModal(false);
  };
  
  return (
    <div>
        <FaTimes onClick={handleClose} />
      {storedUser ? (
        <ul>
          {Object.keys(storedUser).map((key, index) => (
            <li key={index}>
              <strong>{key}:</strong> {JSON.stringify(storedUser[key], null, 2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}
Info.propTypes = {
    setShowProfileModal: PropTypes.func.isRequired
  };
