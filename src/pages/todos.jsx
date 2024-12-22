// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Todos() {
//   const [isChecked, setIsChecked] = useState(true);
//   const { id } = useParams(); // מקבל את ה-id מהכתובת
//   const [userTodos, setUserTodos] = useState([]); // לשמור את הרשימה
//   const [loading, setLoading] = useState(true); // מצב טעינה

//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/todos/?userId=${id}`);
//         const data = await response.json();
//         setUserTodos(data); // עדכון הרשימה
//         setIsChecked(userTodos.completed);
//       } catch (error) {
//         console.error("Error fetching todos:", error);
//       } finally {
//         setLoading(false); // סיום הטעינה
//       }
//     };
//     fetchTodos();
//   }, [id]);

//   return (
//     <div>
//       <h1>Todos</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {userTodos.map((todo) => (
//          <div key={todo.id}>{todo.id}
//          <input type="checkbox" id={`todo-${todo.id}`} value={todo.title} checked={isChecked} onChange={()=>setIsChecked(!isChecked)}/>
//          <label htmlFor={`todo-${todo.id}`}> {todo.title}</label>
//      </div>
//       ))}
//     </ul>
//   )
// }

//     </div >
//   );
// }

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

        // הוספת isChecked לכל טודו
        const todosWithCheckState = data.map((todo) => ({
          ...todo,
          isChecked: todo.completed, // ערך התחלתי מבוסס על ה-completed
        }));

        setUserTodos(todosWithCheckState);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false); // סיום הטעינה
      }
    };
    fetchTodos();
  }, [id]);

  const handleCheckboxChange = (todoId) => {
    // עדכון ה-isChecked עבור todo ספציפי
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
            <div key={todo.id}>
              {todo.id}
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                value={todo.title}
                checked={todo.isChecked}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              <label htmlFor={`todo-${todo.id}`}> {todo.title}</label>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
