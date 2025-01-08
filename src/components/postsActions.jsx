import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { FaTimes} from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import { createResource } from "./ServerRequests"

export function SearchPosts(props) {
    const { setFilteredPosts, userPosts, setIsSearchPostOpen, searchType, setSearchType } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    
    const handleSearchSubmit = () => {
      const queryParams = new URLSearchParams();
      queryParams.set(searchType, searchQuery);
      navigate({ search: queryParams.toString() });
      setFilteredPosts(filterPosts());
    };

    const handleCloseSearch = () => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete(searchType);
      navigate({ search: queryParams.toString() });
      setIsSearchPostOpen(false);
      setSearchQuery("");
      setFilteredPosts(userPosts)
    };
  
    const handleSearchTypeChange = (e) => {
      setSearchType(e.target.value);
      setSearchQuery("");
    };

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const filterPosts = () => {
      return userPosts.filter((todo) => {
        if (searchType === "id") {
          return todo.id.toString().includes(searchQuery);
        } else if (searchType === "title") {
          return todo.title.includes(searchQuery);
        } else if (searchType === "status") {
          return todo.completed.toString().includes(searchQuery);
        }
        return false;
      });
    };
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
  
      </div>);
  
  }
  SearchPosts.propTypes = {
    setFilteredPosts: PropTypes.func.isRequired,
    userPosts: PropTypes.array.isRequired,
    setIsSearchPostOpen: PropTypes.func.isRequired,
    searchType: PropTypes.string.isRequired,
    setSearchType: PropTypes.func.isRequired,
  };
export function EditPost(props){
    const{post,handleUpdateClick,setEditingPost}=props;
    const titleRef = useRef();
    const bodyRef = useRef();
    return(
        <div>
        {post.id}
        <FaTimes onClick={() => setEditingPost(null)}/>
        <input type="text" defaultValue={post.title} ref={titleRef} />
        <input type="text" defaultValue={post.body} ref={bodyRef} />
        <button
            onClick={() =>
                handleUpdateClick(
                    post.id,
                    titleRef.current.value,
                    bodyRef.current.value
                )
            }
        >
            Save
        </button>
    </div>
    )
}
EditPost.propTypes = {
    post: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    handleUpdateClick: PropTypes.func.isRequired,
    setEditingPost: PropTypes.func.isRequired,
  };


export function AddNewPost(props) {
    const { id, setIsAddPostOpen, setUserPosts, sortItems, criterion } = props;
    const [newPost, setNewPost] = useState({ userId: id, title: "", body: "" });
    const newTitle = useRef();
    const newBody = useRef();
    const handleAddPost = () => {
        if (newTitle != null && newTitle !== "" || newBody != null && newBody !== "")
            processNewPost();
    }
    const processNewPost = async () => {
        try {
            const addedPost = await createResource("posts", newPost);
            setUserPosts((prevPosts) => {
                const updatedPosts = [...prevPosts, addedPost];
                return sortItems(criterion, updatedPosts);
            });
            setIsAddPostOpen(false);
            setNewPost({ userId: id, title: "", body: "" });

        } catch (error) {
            console.error("Error adding post:", error.message);
        }
    };
    const handleAddPostInput = (e) => {
        const { name, value } = e.target;
        setNewPost((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };
      
    return (
        <div>
            <FaTimes onClick={() => setIsAddPostOpen(false)} />
            <input name="title" onChange={handleAddPostInput} type="text" value={newPost.title} placeholder="Add title..." />
            <input name="body" onChange={handleAddPostInput} type="text" value={newPost.body} placeholder="Add body..." />
            <button onClick={handleAddPost}>Save post</button>
        </div>
    )
}
AddNewPost.propTypes = {
    id: PropTypes.number.isRequired, 
    setIsAddPostOpen: PropTypes.func.isRequired, 
    setUserPosts: PropTypes.func.isRequired, 
    sortItems: PropTypes.func.isRequired,  
    criterion: PropTypes.string.isRequired 
  };
