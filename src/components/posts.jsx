import { useEffect, useState, useRef,createContext} from "react";
import { useParams, useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { FaTrash, FaTimes } from 'react-icons/fa';
import './style.css';

const UserContext = createContext();
export {UserContext}
export default function Posts() {
    const { id } = useParams();
    const location = useLocation();
    const titleRef = useRef();
    const bodyRef = useRef();
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const [searchType, setSearchType] = useState("id");
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);
    const [isSearchPostOpen, setIsSearchPostOpen] = useState(false);
    const [isSearchPost, setIsSearchPost] = useState(false);
    const [newPost, setNewPost] = useState({ userId: id, title: "", body: "" });
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [criterion, setCriterion] = useState('id');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQueryFromUrl = queryParams.get('search') || '';
        setSearchQuery(searchQueryFromUrl);
    }, [location]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts?userId=${id}`);
                const data = await response.json();
                setUserPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [id]);

    const filterPosts = (posts) => {
        return posts.filter((post) => {
            if (searchType === "id") {
                return post.id.toString().includes(searchQuery);
            } else if (searchType === "title") {
                return post.title.includes(searchQuery);
            }
            return false;
        });
    };
    // const handleSearchChange = (e) => {
    //     setSearchQuery(e.target.value);
    // };

    // const handleSearchSubmit = () => {
    //     const queryParams = new URLSearchParams();
    //     queryParams.set('search', searchQuery);
    //     navigate({ search: queryParams.toString() });
    //     setIsSearchPostOpen(false);
    // };

    const handleTrashClick = async (id) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            setUserPosts((prevPosts) => prevPosts.filter(post => post.id !== id));
        }
        else {
            console.error('Error:', response.status, response.statusText);
        }
    };
    const handleChangeSort = (event) => {
        setCriterion(event.target.value);
        const sortedPosts = sortItems(event.target.value, [...userPosts]);
        setUserPosts(sortedPosts);
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
            case 'random':
                sortedItems.sort(() => Math.random() - 0.5);
                break;
            default:
                break;
        }
        return sortedItems;
    };

    const addPostToServer = async () => {
        const response = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        });
        const addedPost = await response.json();
        console.log(addedPost);
        if (response.ok) {
            setUserPosts((prevPosts) => {
                const updatedPosts = [...prevPosts, addedPost];
                return sortItems(criterion, updatedPosts);
            })
            setIsAddPostOpen(false)
            setNewPost({ userId: id, title: "" });
        }
    };

    const addPost = () => {
        if (newPost.title !== "") {
            addPostToServer();
        }
    };

    const handleAddTitlePostInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewPost((prevState) => ({
            ...prevState,
            title: value
        }));
    };
    
    const handleAddBodyPostInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewPost((prevState) => ({
            ...prevState,
            body: value
        }));
    };

    const searchPostClicked = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('search', '');
        navigate({ search: queryParams.toString() });
        setIsSearchPostOpen(true);
    };

    const addPostClicked = () => {
        setIsAddPostOpen(true);
    };

    const handleCloseSearch = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('search');
        navigate({ search: queryParams.toString() });
        setIsSearchPostOpen(false);
        setIsSearchPost(false);
        setSearchQuery("");
    };
    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery("");
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        const queryParams = new URLSearchParams();
        queryParams.set("search", searchQuery);
        navigate({ search: queryParams.toString() });
        setIsSearchPost(true);

    };

    // const filterTodos = (todos) => {
    //     return todos.filter((todo) => {
    //         if (searchType === "id") {
    //             return todo.id.toString().includes(searchQuery);
    //         } else if (searchType === "title") {
    //             return todo.title.includes(searchQuery);
    //         } else if (searchType === "status") {
    //             return todo.completed.toString().includes(searchQuery);
    //         }
    //         return false;
    //     });
    // };
    const filteredPosts = !isSearchPost ? userPosts : filterPosts(userPosts)

    return (
        <UserContext.Provider value={selectedPost}>
            <div className="posts-container">
                <div className="outlet-wrapper">
                    {selectedPost && <Outlet context={{ setSelectedPost,editingPost,setEditingPost,titleRef,bodyRef ,setUserPosts }}/>}
                </div>
    
                <div>
                    <h1>Posts</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div>
                                <button onClick={addPostClicked}>Add post</button>
                                <button onClick={searchPostClicked}>Search post</button>
                                <label htmlFor="sort-select">Sort by:</label>
                                <select id="sort-select" onChange={handleChangeSort}>
                                    <option value="id">ID</option>
                                    <option value="alphabetical">Alphabetical</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>
                            {isAddPostOpen && (
                                <div>
                                    <FaTimes onClick={() => setIsAddPostOpen(false)} />
                                    <input name="title" onChange={handleAddTitlePostInput} type="text" value={newPost.title} placeholder="Add title..." />
                                    <input name="body" onChange={handleAddBodyPostInput} type="text" value={newPost.body} placeholder="Add body..." />
                                    <button onClick={addPost}>Save post</button>
                                </div>
                            )}
                            {isSearchPostOpen && (
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
                            )}
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <div key={post.id} className="post-item">
                                            <div>
                                                {post.id}
                                                <div>{post.title} <div />
                                                    <Link to={`${post.id}`} onClick={() => setSelectedPost(post)} className="nav-link">Show post</Link>
                                                    <FaTrash
                                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                        onClick={() => handleTrashClick(post.id)}
                                                    />
 
                                                </div>
                                            </div>
                                    </div>
                                ))
                            ) : (
                                <div>No posts match your search criteria</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </UserContext.Provider>
    );
    
}
