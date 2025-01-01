import { useEffect, useState, useRef,createContext} from "react";
import { useParams, useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { FaTrash, FaTimes } from 'react-icons/fa';
import './todos.css';

const UserContext = createContext();
export {UserContext}
export default function Posts() {
    const { id } = useParams();
    const location = useLocation();
    const titleRef = useRef();
    const bodyRef = useRef();
    const navigate = useNavigate();
    const [userposts, setUserposts] = useState([]);
    const [isAddpostOpen, setIsAddpostOpen] = useState(false);
    const [isSearchpostOpen, setIsSearchpostOpen] = useState(false);
    const [newPost, setNewPost] = useState({ userId: id, title: "", body: "" });
    const [loading, setLoading] = useState(true);
    const [editingpost, setEditingpost] = useState(null);
    const [criterion, setCriterion] = useState('id');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQueryFromUrl = queryParams.get('search') || '';
        setSearchQuery(searchQueryFromUrl);
    }, [location]);

    useEffect(() => {
        const fetchposts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/posts?userId=${id}`);
                const data = await response.json();
                setUserposts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchposts();
    }, [id]);

    const filterposts = (posts) => {
        return posts.filter(post => {
            return (
                post.id.toString().includes(searchQuery) || post.title.includes(searchQuery)
                // ||(post.completed.toString().includes(searchQuery))
            );
            //להפריד לסלקט שאחרי הבחירה ע''י איזה חיפוש יפתח לי תיבת חיפוש- תיבת החיפוש לא ניפתחת לבד....
        });
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        const queryParams = new URLSearchParams();
        queryParams.set('search', searchQuery);
        navigate({ search: queryParams.toString() });
        setIsSearchpostOpen(false);
    };

    const handleTrashClick = async (id) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            setUserposts((prevposts) => prevposts.filter(post => post.id !== id));
        }
        else {
            console.error('Error:', response.status, response.statusText);
        }
    };
    const handleChangeSort = (event) => {
        setCriterion(event.target.value);
        const sortedposts = sortItems(event.target.value, [...userposts]);
        setUserposts(sortedposts);
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

    const addpostToServer = async () => {
        const response = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        });
        const addedpost = await response.json();
        console.log(addedpost);
        if (response.ok) {
            setUserposts((prevposts) => {
                const updatedposts = [...prevposts, addedpost];
                return sortItems(criterion, updatedposts);
            })
            setIsAddpostOpen(false)
            setNewPost({ userId: id, title: "" });
        }
    };

    const addpost = () => {
        if (newPost.title !== "") {
            addpostToServer();
        }
    };

    const handleAddTitlepostInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewPost((prevState) => ({
            ...prevState,
            title: value
        }));
    };
    
    const handleAddBodypostInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewPost((prevState) => ({
            ...prevState,
            body: value
        }));
    };

    const searchpostClicked = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('search', '');
        navigate({ search: queryParams.toString() });
        setIsSearchpostOpen(true);
    };

    const addpostClicked = () => {
        setIsAddpostOpen(true);
    };

    const handleCloseSearch = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('search');
        navigate({ search: queryParams.toString() });
        setIsSearchpostOpen(false);
        setSearchQuery("");
    };

    const filteredposts = isSearchpostOpen ? userposts : filterposts(userposts)

    return (
        <UserContext.Provider value={selectedPost}>
            <div className="posts-container">
                <div className="outlet-wrapper">
                    {selectedPost && <Outlet context={{ setSelectedPost,editingpost,setEditingpost,titleRef,bodyRef ,setUserposts }}/>}
                </div>
    
                <div>
                    <h1>Posts</h1>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div>
                                <button onClick={addpostClicked}>Add post</button>
                                <button onClick={searchpostClicked}>Search post</button>
                                <label htmlFor="sort-select">Sort by:</label>
                                <select id="sort-select" onChange={handleChangeSort}>
                                    <option value="id">ID</option>
                                    <option value="alphabetical">Alphabetical</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>
                            {isAddpostOpen && (
                                <div>
                                    <FaTimes onClick={() => setIsAddpostOpen(false)} />
                                    <input name="title" onChange={handleAddTitlepostInput} type="text" value={newPost.title} placeholder="Add title..." />
                                    <input name="body" onChange={handleAddBodypostInput} type="text" value={newPost.body} placeholder="Add body..." />
                                    <button onClick={addpost}>Save post</button>
                                </div>
                            )}
                            {isSearchpostOpen && (
                                <div>
                                    <FaTimes onClick={handleCloseSearch} />
                                    <input
                                        type="text"
                                        placeholder="Search by ID, title, or status..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    <button onClick={handleSearchSubmit}>Search</button>
                                </div>
                            )}
                            {filteredposts.length > 0 ? (
                                filteredposts.map((post) => (
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
