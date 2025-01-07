import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from 'react-icons/fa';
import './style.css';
import { updateResource, fetchResource, deleteResource, createResource } from "./ServerRequests"
import { SearchTodos, AddNewTodo } from './TodosActions'
export default function Todos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userTodos, setUserTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isSearchTodoOpen, setIsSearchTodoOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({ userId: id, title: "", completed: false });
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [criterion, setCriterion] = useState('id');
  const [searchType, setSearchType] = useState("id");
  const titleRef = useRef();
  const completedRef = useRef();




  useEffect(() => {

    const fetchTodos = async () => {
      try {
        const data = await fetchResource(id, 'todos', 'userId');
        setUserTodos(data);
        setFilteredTodos(data)
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [id]);

  const handleCheckboxChange = async (id) => {
    try {
      const foundTodo = userTodos.find((todo) => todo.id === id);
      const updatedTodo = { ...foundTodo, completed: !foundTodo.completed };
      const result = await updateResource(id, updatedTodo, "todos");
      setUserTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? result : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleSaveEdit = async (id, newTitle, newCompleted) => {
    try {
      const newTodo = JSON.stringify({
        userId: id,
        title: newTitle,
        completed: newCompleted
      })
      const response = await updateResource(id, newTodo, 'todos')

      if (response.ok) {
        setUserTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, title: newTitle } : todo
          )
        );
        setEditingTodo(null);
      } else {
        console.error('Error updating todo:', response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  const handleTrashClick = async (id) => {
    try {
      await deleteResource(id, "todos");
      setUserTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const addTodoToServer = async () => {
    try {
      const addedTodo = await createResource("todos", newTodo);
      setUserTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, addedTodo];
        return sortItems(criterion, updatedTodos);
      });
      setFilteredTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, addedTodo];
        return sortItems(criterion, updatedTodos);
      })
      setIsAddTodoOpen(false);
      setNewTodo({ userId: id, title: "" });

    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
  };

  const handleChangeSort = (event) => {
    setCriterion(event.target.value);
    const sortedTodos = sortItems(event.target.value, [...userTodos]);
    setUserTodos(sortedTodos);
  };

  const sortItems = (criterion, items) => {
    const sortedItems = [...items];
    switch (criterion) {
      case 'id':
        sortedItems.sort((a, b) => a.id - b.id);
        break;
      case 'alphabetical':
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'performance':
        sortedItems.sort((a, b) => a.completed - b.completed);
        break;
      case 'random':
        sortedItems.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    return sortedItems;
  };

  const addTodoClicked = () => {
    setIsAddTodoOpen(true);
  };

  const searchTodoClicked = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete('search');
    queryParams.set(searchType, '');
    navigate({ search: queryParams.toString() });
    setIsSearchTodoOpen(true);
  };
  return (
    <div>
      <h1>Todos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <button onClick={addTodoClicked}>Add todo</button>
            <button onClick={searchTodoClicked}>Search todo</button>
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" onChange={handleChangeSort}>
              <option value="id">ID</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="performance">Completion</option>
              <option value="random">Random</option>
            </select>
          </div>
          {isAddTodoOpen && <AddNewTodo newTodo={newTodo}
            setNewTodo={setNewTodo}
            addTodoToServer={addTodoToServer}
            setIsAddTodoOpen={setIsAddTodoOpen} />}
          {
            isSearchTodoOpen && <SearchTodos setFilteredTodos={setFilteredTodos} userTodos={userTodos} setIsSearchTodoOpen={setIsSearchTodoOpen} searchType={searchType} setSearchType={setSearchType} />
          }
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="todo-item">
                {editingTodo && editingTodo.id === todo.id ? (
                  <div>
                    {todo.id}
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      value={todo.title}
                      checked={todo.completed}
                      ref={completedRef}
                      onChange={() => handleCheckboxChange(todo.id)}
                    />
                    <input
                      type="text"
                      defaultValue={todo.title}
                      ref={titleRef}
                    />
                    <button
                      onClick={() =>
                        handleSaveEdit(
                          todo.id,
                          titleRef.current.value,
                          completedRef.current.value
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    {todo.id}
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      value={todo.title}
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(todo.id)}
                    />
                    {todo.title}
                    <FaTrash
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() => handleTrashClick(todo.id)}
                    />
                    <FaEdit
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() => handleEditClick(todo)}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No todos match your search criteria</div>
          )}
        </>
      )}
    </div>
  );
}
