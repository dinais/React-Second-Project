import { useState} from "react";
import { FaTrash, FaEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { updateResource,deleteResource} from "./ServerRequests"
import { EditTodo } from './TodosActions'
import './style.css';
export function TodosList(props) {
  const { todosArray, filtered, userTodos, setUserTodos } = props;
  const [editingTodo, setEditingTodo] = useState(null);
  const handleUpdateClick = async (id, updatedTitle = null) => {
    try {
      const foundTodo = userTodos.find((todo) => todo.id === id);
      const updatedTodo = { ...foundTodo, completed: !foundTodo.completed, ...(updatedTitle !== null && { title: updatedTitle }), };
      const result = await updateResource(id, updatedTodo, "todos");
      setUserTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            return updatedTitle !== null ? { ...todo, title: updatedTitle } : result;
          }
          return todo;
        })
      );
      if (updatedTitle)
        setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };
  const handleTrashClick = async (id) => {
    try {
      await deleteResource(id, "todos");
      setUserTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };
  return (<>
    {todosArray.length > 0 ? (
      todosArray.map((todo) => (
        <div key={todo.id} className="todo-item">
          {editingTodo && editingTodo.id === todo.id ? <EditTodo todo={todo} handleUpdateClick={handleUpdateClick} setEditingTodo={setEditingTodo}/> : (
            <div>
              {todo.id}
              <input
                type="checkbox"
                id={`todo-${todo.id}`}
                value={todo.title}
                checked={todo.completed}
                onChange={() => handleUpdateClick(todo.id)}
              />
              {todo.title}
              <FaTrash
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => handleTrashClick(todo.id)}
              />
              <FaEdit
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => setEditingTodo(todo)}
              />
            </div>
          )}
        </div>
      ))
    ) : (
      filtered?(<div>No todos match your search criteria</div>
      ):(
      <div>You do not have any todos, create some!</div>
    )
  )}
  </>)
}
TodosList.propTypes = {
  todosArray: PropTypes.array.isRequired,
  filtered: PropTypes.bool.isRequired,
  userTodos: PropTypes.array.isRequired,
  setUserTodos: PropTypes.func.isRequired,
};