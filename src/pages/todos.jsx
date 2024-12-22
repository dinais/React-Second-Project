import { useEffect, useState } from "react";  
import { useParams } from "react-router-dom";

export default function Todos() {
  const { id } = useParams(); // מקבל את ה-id מהכתובת
  const [userTodos, setUserTodos] = useState([]); // לשמור את הרשימה
  const [loading, setLoading] = useState(true); // מצב טעינה

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos/?userId=${id}`);
        const data = await response.json();
        setUserTodos(data); // עדכון הרשימה
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false); // סיום הטעינה
      }
    };
    fetchTodos();
  }, [id]);

  return (
    <div>
      <h1>Todos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {userTodos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
