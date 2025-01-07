import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { createResource } from "./ServerRequests"
import './style.css';
export function SearchTodos(props) {
  const { setFilteredTodos, userTodos, setIsSearchTodoOpen, searchType, setSearchType } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams();
    queryParams.set(searchType, searchQuery);
    navigate({ search: queryParams.toString() });
    setFilteredTodos(filterTodos());
  };
  const handleCloseSearch = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete(searchType);
    navigate({ search: queryParams.toString() });
    setIsSearchTodoOpen(false);
    setSearchQuery("");
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
  return (
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
  setFilteredTodos: PropTypes.func.isRequired,
  userTodos: PropTypes.array.isRequired,
  setIsSearchTodoOpen: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  setSearchType: PropTypes.func.isRequired,
};

export function AddNewTodo(props) {
  const { id, setIsAddTodoOpen, setUserTodos, sortItems, criterion } = props;
  const [newTodo, setNewTodo] = useState({ userId: id, title: "", completed: false });
  const newTitle = useRef(null)
  const handleAddTodo = () => {
    if (newTitle != null && newTitle !== "")
      processNewTodo();
  }
  const processNewTodo = async () => {
    try {
      const addedTodo = await createResource("todos", newTodo);
      setUserTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, addedTodo];
        return sortItems(criterion, updatedTodos);
      });
      setIsAddTodoOpen(false);
      setNewTodo({ userId: id, title: "" });

    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  };
  const handleAddTodoInput = (e) => {
    const { value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      title: value
    }));
  };

  return (<div>
    <FaTimes onClick={() => setIsAddTodoOpen(false)} />
    <input name="title" onChange={handleAddTodoInput} ref={newTitle} type="text" value={newTodo.title} placeholder="Add title..." />
    <button onClick={handleAddTodo}>Save todo</button>
  </div>)
}
AddNewTodo.propTypes = {
  id: PropTypes.number.isRequired,
  setIsAddTodoOpen: PropTypes.func.isRequired,
  setUserTodos: PropTypes.func.isRequired,
  sortItems: PropTypes.func.isRequired,
  criterion: PropTypes.string.isRequired,
};

export function EditTodo(props) {
  const { todo, handleUpdateClick,setEditingTodo } = props;
  const titleRef = useRef();
  return (<div>
    {todo.id}
    <FaTimes onClick={() => setEditingTodo(null)}/>
    <input
      type="checkbox"
      id={`todo-${todo.id}`}
      value={todo.title}
      checked={todo.completed}
      onChange={() => handleUpdateClick(todo.id)}
    />
    <input
      type="text"
      defaultValue={todo.title}
      ref={titleRef}
    />
    <button
      onClick={() =>
        handleUpdateClick(
          todo.id,
          titleRef.current.value
        )
      }
    >
      Save
    </button>
  </div>)
}
EditTodo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  handleUpdateClick: PropTypes.func.isRequired,
  setEditingTodo: PropTypes.func.isRequired
};