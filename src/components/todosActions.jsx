import { useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
export function SearchTodos(props) {
    const{setFilteredTodos,userTodos,setIsSearchTodoOpen,searchType,setSearchType}=props;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchSubmit = () => {
        const queryParams = new URLSearchParams();
        queryParams.set(searchType, searchQuery);  // שמירה לפי הסוג והערך שהוזן
        navigate({ search: queryParams.toString() });  // עדכון ה-URL
        setFilteredTodos(filterTodos());
    };
    const handleCloseSearch = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete(searchType);  // מחיקת הסוג מתוך ה-URL
        navigate({ search: queryParams.toString() });  // עדכון ה-URL
        setIsSearchTodoOpen(false);  // סגירת החיפוש
        setSearchQuery("");  // איפוס הערך בחיפוש
        setFilteredTodos(userTodos)
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery("");
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    const filterTodos = () => {
        return userTodos.filter((todo) => {
            if (searchType === "id") {
                return todo.id.toString().includes(searchQuery);
            } else if (searchType === "title") {
                return todo.title.includes(searchQuery);
            } else if (searchType === "status") {
                return todo.completed.toString().includes(searchQuery);
            }
            return false;
        });
    };
    return(
        <div>
          <FaTimes onClick={handleCloseSearch} />
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            style={{ marginRight: "10px" }}
          >
            <option value="id">Search by ID</option>
            <option value="title">Search by Title</option>
            <option value="status">Search by Status</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchType}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "10px" }}
          />
          <button onClick={handleSearchSubmit}>Search</button>

        </div>);
 
}
SearchTodos.propTypes = {
    setFilteredTodos: PropTypes.func.isRequired,  // setFilteredTodos חייב להיות פונקציה
    userTodos: PropTypes.array.isRequired,        // userTodos חייב להיות מערך
    setIsSearchTodoOpen: PropTypes.func.isRequired,  // setIsSearchTodoOpen חייב להיות פונקציה
    searchType: PropTypes.string.isRequired,      // searchType חייב להיות מיתר
    setSearchType: PropTypes.func.isRequired,     // setSearchType חייב להיות פונקציה
  };
//   export function TodosList(props) {
//     return(<></>)
//   }
export function AddNewTodo(props){
    const{newTodo,setNewTodo,addTodoToServer,setIsAddTodoOpen}=props;
    const addTodo = () => {
        if (newTodo.title !== "") {
          addTodoToServer();
        }
      };
    
      const handleAddTodoInput = (e) => {
        const { value } = e.target;
        setNewTodo((prevState) => ({
          ...prevState,
          title: value
        }));
      };
      
    return( <div>
        <FaTimes onClick={() => setIsAddTodoOpen(false)} />
        <input name="title" onChange={handleAddTodoInput} type="text" value={newTodo.title} placeholder="Add title..." />
        <button onClick={addTodo}>Save todo</button>
      </div>)
}
AddNewTodo.propTypes = {
    newTodo: PropTypes.shape({
      userId: PropTypes.string.isRequired,  // userId חייב להיות מיתר
      title: PropTypes.string.isRequired,   // title חייב להיות מיתר
      completed: PropTypes.bool.isRequired, // completed חייב להיות בוליאני
    }).isRequired,  // newTodo חייב להיות אובייקט עם התכונות האלו
    setNewTodo: PropTypes.func.isRequired, // setNewTodo חייב להיות פונקציה
    addTodoToServer: PropTypes.func.isRequired, // addTodoToServer חייב להיות פונקציה
    setIsAddTodoOpen: PropTypes.func.isRequired, // setIsAddTodoOpen חייב להיות פונקציה
  };