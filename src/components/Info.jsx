// import { useUser } from "../contexts/useUser";
// import {FaTimes } from "react-icons/fa";
// import {PropTypes}from"prop-types"
// export default function Info(props) {
//   const { userData } = useUser();
//   const storedUser = userData || JSON.parse(localStorage.getItem("currentUser"));
// const{setShowProfileModal}=props;
// const handleClose = () => {
//     setShowProfileModal(false);
//   };
  
//   return (
//     <div className="sidebar-overlay">
//     <div className="sidebar">
//       <FaTimes className="close-btn" onClick={handleClose} />
//       {storedUser ? (
//         <ul>
//           {Object.keys(storedUser).map((key, index) => (
//             <li key={index} className="user-info">
//               <strong>{key}:</strong> {JSON.stringify(storedUser[key], null, 2)}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No user data available</p>
//       )}
//     </div>
//   </div>
// );
// }

// Info.propTypes = {
//     setShowProfileModal: PropTypes.func.isRequired
//   };
import { useUser } from "../contexts/useUser";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

export default function Info(props) {
  const { userData } = useUser();
  const storedUser = userData || JSON.parse(localStorage.getItem("currentUser"));
  const { setShowProfileModal } = props;
  
  const handleClose = () => {
    setShowProfileModal(false);
  };

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <ul>
          {Object.keys(value).map((subKey, subIndex) => (
            <li key={subIndex}>
              <span className="key">{subKey}:</span> {renderValue(value[subKey])}
            </li>
          ))}
        </ul>
      );
    } else {
      return <span>{value}</span>;
    }
  };

  return (
    <div className="sidebar-overlay">
      <div className="sidebar">
        <FaTimes className="close-btn" onClick={handleClose} />
        {storedUser ? (
          <ul>
            {Object.keys(storedUser).map((key, index) => (
              <li key={index} className="user-info">
                <span className="key">{key}:</span> {renderValue(storedUser[key])}
              </li>
            ))}
          </ul>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </div>
  );
}

Info.propTypes = {
  setShowProfileModal: PropTypes.func.isRequired
};
