import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Todos() {
  const { id } = useParams();   
  const [userTodos, setUserTodos] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos?userId=${id}`);
        const data = await response.json();
        const todosWithCheckState = data.map((todo) => ({
          ...todo,
          isChecked: todo.completed, 
        }));

        setUserTodos(todosWithCheckState);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchTodos();
  }, [id]);

  const handleCheckboxChange = (todoId) => {
    setUserTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isChecked: !todo.isChecked } : todo
      )
    );
  };

  return (
    <div>
      <h1>Todos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {userTodos.map((todo) => (
            <li style={{ listStyleType: "none", padding: 0, margin: 0 }} key={todo.id}>{todo.id} {/* שימוש ב-key */}
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                value={todo.title}
                checked={todo.isChecked}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              <label htmlFor={`todo-${todo.id}`}> {todo.title}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}