import PropTypes from 'prop-types';
export function PostsActionsBar(props) {
    const { setIsAddPostOpen, searchPostClicked, handleChangeSort, allPostsVisible, setAllPostsVisible } = props;
    return (
        <div className='posts-bar'>
            <button onClick={() => setIsAddPostOpen(true)}>Add post</button>
            <button onClick={searchPostClicked}>Search post</button>
            <button onClick={() => setAllPostsVisible(!allPostsVisible)}>
                {allPostsVisible ? "Show my posts" : "Show all posts"}
            </button>
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" onChange={handleChangeSort}>
                <option value="id">ID</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="random">Random</option>
            </select>
        </div>
    )
}
PostsActionsBar.propTypes = {
    setIsAddPostOpen: PropTypes.func.isRequired,
    searchPostClicked: PropTypes.func.isRequired,
    handleChangeSort: PropTypes.func.isRequired,
    allPostsVisible: PropTypes.bool.isRequired,
    setAllPostsVisible: PropTypes.func.isRequired
  };