import PropTypes from 'prop-types';
import './style.css';
export function TodoActionsBar(props) {
    const{setIsAddTodoOpen,searchTodoClicked,handleChangeSort}=props;
    return (
    <div className='todo-bar'>
        <button onClick={() => setIsAddTodoOpen(true)}>Add todo</button>
        <button onClick={searchTodoClicked}>Search todo</button>
        <label htmlFor="sort-select">Sort by:</label>
        <select id="sort-select" onChange={handleChangeSort}>
            <option value="id">ID</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="performance">Completion</option>
            <option value="random">Random</option>
        </select>
    </div>
    )
}
TodoActionsBar.propTypes = {
    setIsAddTodoOpen: PropTypes.func.isRequired, 
    searchTodoClicked: PropTypes.func.isRequired,
    handleChangeSort: PropTypes.func.isRequired,  
  };