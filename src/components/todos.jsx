import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchResource } from "./ServerRequests"
import { SearchTodos, AddNewTodo } from './TodosActions'
import { TodosList } from './TodosList'
import { TodoActionsBar } from "./TodoActionsBar"
import './style.css';
export default function Todos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userTodos, setUserTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isSearchTodoOpen, setIsSearchTodoOpen] = useState(false);
  const [criterion, setCriterion] = useState('id');
  const [searchType, setSearchType] = useState("id");
  const location = useLocation()

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const queryString = queryParams.toString();
    const fetchTodos = async () => {
      try {
        const data = await fetchResource(id, 'todos', 'userId', queryString);
        setUserTodos(data);
        setFilteredTodos(data)
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, [id, location]);

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

  const searchTodoClicked = () => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete('search');
    queryParams.set(searchType, '');
    navigate({ search: queryParams.toString() });
    setIsSearchTodoOpen(true);
    console.log('search clicked');

  };
  return (
    <div>
      <h1>Todos</h1>
      <>
        <TodoActionsBar
          setIsAddTodoOpen={setIsAddTodoOpen}
          searchTodoClicked={searchTodoClicked}
          handleChangeSort={handleChangeSort}
        />
        {isAddTodoOpen && <AddNewTodo
          id={id}
          setIsAddTodoOpen={setIsAddTodoOpen}
          setUserTodos={setUserTodos}
          sortItems={sortItems}
          criterion={criterion} />}
        {
          isSearchTodoOpen && <SearchTodos setFilteredTodos={setFilteredTodos} userTodos={userTodos} setIsSearchTodoOpen={setIsSearchTodoOpen} searchType={searchType} setSearchType={setSearchType} />
        }
        <TodosList todosArray={isSearchTodoOpen ? filteredTodos : userTodos} filtered={isSearchTodoOpen} userTodos={userTodos} setUserTodos={setUserTodos} />
      </>
    </div>
  );
}
