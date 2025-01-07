import PropTypes from 'prop-types';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { Link, Outlet } from "react-router-dom";
export function SearchPost(props) {
    const { handleCloseSearch, searchType, handleSearchTypeChange, searchQuery, handleSearchChange, handleSearchSubmit } = props;
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
            </select>
            <input
                type="text"
                placeholder={`Enter ${searchType}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginRight: "10px" }}
            />
            <button onClick={handleSearchSubmit}>Search</button>
        </div>
    )
}
SearchPost.propTypes = {
    handleCloseSearch: PropTypes.func.isRequired,
    searchType: PropTypes.string.isRequired,
    handleSearchTypeChange: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    handleSearchSubmit: PropTypes.func.isRequired,
};

export function PostsList(props) {
    const { filteredPosts, selectedPost, setSelectedPost, editingPost, setEditingPost, titleRef, bodyRef, setUserPosts, handleTrashClick } = props;
    return (
        <>
            {

                filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="post-item">
                            <div>
                                {selectedPost?.id == post.id ? (<Outlet context={{ setSelectedPost, editingPost, setEditingPost, titleRef, bodyRef, setUserPosts, selectedPost }} />) : (<> {post.id}
                                    <div>{post.title} <div />
                                        <Link to={`${post.id}`} onClick={() => setSelectedPost(post)} className="nav-link">Show post</Link>
                                        <FaTrash
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => handleTrashClick(post.id)}
                                        />
                                    </div></>)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No posts match your search criteria</div>
                )

            }
        </>
    )
}
PostsList.propTypes = {
    filteredPosts: PropTypes.array.isRequired,
    selectedPost: PropTypes.object,
    setSelectedPost: PropTypes.func.isRequired,
    editingPost: PropTypes.object,
    setEditingPost: PropTypes.func.isRequired,
    titleRef: PropTypes.object.isRequired,
    bodyRef: PropTypes.object.isRequired,
    setUserPosts: PropTypes.func.isRequired,
    handleTrashClick: PropTypes.func.isRequired,
};

export function AddNewPost(props) {
    const { setIsAddPostOpen, handleAddTitlePostInput, handleAddBodyPostInput, newPost, addPost } = props;
    return (
        <div>
            <FaTimes onClick={() => setIsAddPostOpen(false)} />
            <input name="title" onChange={handleAddTitlePostInput} type="text" value={newPost.title} placeholder="Add title..." />
            <input name="body" onChange={handleAddBodyPostInput} type="text" value={newPost.body} placeholder="Add body..." />
            <button onClick={addPost}>Save post</button>
        </div>
    )
}
AddNewPost.propTypes = {
    setIsAddPostOpen: PropTypes.func.isRequired,
    handleAddTitlePostInput: PropTypes.func.isRequired,
    handleAddBodyPostInput: PropTypes.func.isRequired,
    newPost: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
    }).isRequired,
    addPost: PropTypes.func.isRequired,
};
