import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import './todos.css'
export default function Todos() {
  const { id } = useParams();
  const [userTodos, setUserTodos] = useState([]);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({ userId: id, title: "",completed:false });
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [criterion, setCriterion] = useState('id');
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos?userId=${id}`);
        const data = await response.json();
        setUserTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [id]);

  const handleCheckboxChange = async (id) => {
    const foundTodo = userTodos.find(todo => todo.id === id);
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !foundTodo.completed })
    });
    if (response.ok) {
      setUserTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } else {
      console.error('Error updating todo:', response.status, response.statusText);
    }
  };

  const handleTrashClick = async (id) => {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      setUserTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    }
    else {
      console.error('Error:', response.status, response.statusText);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = async (id, newTitle) => {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle })
    });
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
  };

  const handleChangeSort = (event) => {
    setCriterion(event.target.value)
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
  const addTodoToServer = async () => {
    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const addedTodo = await response.json();
    console.log(addedTodo);
    if (response.ok) {
      setUserTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, addedTodo];
        return sortItems(criterion, updatedTodos);
      })
      setIsAddTodoOpen(false)
      setNewTodo({ userId: id, title: "" });
    }
  }
  const addTodo = () => {
    if (newTodo.title != "") {
      addTodoToServer();
    }
  }
  const handleAddTodoInput = (e) => {
    const { value } = e.target;
    setNewTodo((prevState) => ({
      ...prevState,
      title: value
    }));
  };
  const addTodoClicked = () => {
    setIsAddTodoOpen(true)
  }
  return (
    <div>
      <h1>Todos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        userTodos.length > 0 ? (
          <div>
            <button onClick={addTodoClicked}>Add todo</button>
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" onChange={handleChangeSort}>
              <option value="id">ID</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="performance">Completion</option>
              <option value="random">Random</option>
            </select>
            {isAddTodoOpen && (
              <div>
                <FaTimes
                  onClick={() => setIsAddTodoOpen(false)}
                />
                <input name="title" onChange={handleAddTodoInput} type="text" value={newTodo.title} placeholder="Add title..." />
                <button onClick={addTodo}>Save todo</button>
              </div>
            )}
            {userTodos.map((todo) => (
              <div key={todo.id} className="todo-item">
                {editingTodo && editingTodo.id === todo.id ? (
                  <div>
                    {todo.id}
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      value={todo.title}
                      checked={todo.completed}
                      onChange={() => handleCheckboxChange(todo.id)}
                    />
                    <input
                      type="text"
                      defaultValue={todo.title}
                      id={`edit-${todo.id}`}
                    />
                    <button
                      onClick={() => handleSaveEdit(todo.id, document.getElementById(`edit-${todo.id}`).value)}
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
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setIsAddTodoOpen(true)}>Add todo</button>
            <div>No todos yet! Create some...</div>
          </div>
        )
      )}
    </div>
  );
}
