import { useEffect, useState, useRef, createContext, useContext } from "react";
import { useParams, useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import './todos.css';

export default function Posts() {
    const { id } = useParams();
    const location = useLocation();
    const titleRef = useRef();
    const bodyRef = useRef();
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const [searchType, setSearchType] = useState("id");
    const [isAddpostOpen, setIsAddpostOpen] = useState(false);
    const [isSearchPostOpen, setIsSearchPostOpen] = useState(false);
    const [isSearchPost, setIsSearchPost] = useState(false);
    const [newPost, setNewPost] = useState({ userId: id, title: "", body: "" });
    const [loading, setLoading] = useState(true);
    const [editingpost, setEditingpost] = useState(null);
    const [criterion, setCriterion] = useState('id');
    const [searchQuery, setSearchQuery] = useState("");

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
                setUserPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchposts();
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
    const handleTrashClick = async (id) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            setUserPosts((prevposts) => prevposts.filter(post => post.id !== id));
        }
        else {
            console.error('Error:', response.status, response.statusText);
        }
    };

    const handleEditClick = (post) => {
        setEditingpost(post);
    };

    const handleSaveEdit = async (id, newTitle, newBody) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: id,
                    title: newTitle,
                    body: newBody,
                }),
            });

            if (response.ok) {
                setUserPosts((prevposts) =>
                    prevposts.map((post) =>
                        post.id === id ? { ...post, title: newTitle, body: newBody } : post
                    )
                );
                setEditingpost(null);
            } else {
                console.error("Error updating post:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };
    const handleChangeSort = (event) => {
        setCriterion(event.target.value);
        const sortedposts = sortItems(event.target.value, [...userPosts]);
        setUserPosts(sortedposts);
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
            setUserPosts((prevposts) => {
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
        setIsSearchPostOpen(true);
    };

    const addpostClicked = () => {
        setIsAddpostOpen(true);
    };

    const handleCloseSearch = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete("search");
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

    const filterTodos = (todos) => {
        return todos.filter((todo) => {
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
    const filteredposts = !isSearchPost ? userPosts : filterPosts(userPosts)

    return (
        <div>
            <h1>posts</h1>
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
                    {filteredposts.length > 0 ? (
                        filteredposts.map((post) => (
                            <div key={post.id} className="post-item">
                                {editingpost && editingpost.id === post.id ? (
                                    <div>
                                        {post.id}
                                        <input
                                            type="text"
                                            defaultValue={post.title}
                                            ref={titleRef}
                                        />
                                        <input
                                            type="text"
                                            defaultValue={post.body}
                                            ref={bodyRef}
                                        />
                                        <button
                                            onClick={() =>
                                                handleSaveEdit(
                                                    post.id,
                                                    titleRef.current.value,
                                                    bodyRef.current.value
                                                )
                                            }
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {post.id}
                                        <div>{post.title} <div />
                                            {/* <div> {post.body}</div> */}
                                            <Link to={`${post.id}`} className="nav-link">Show post</Link>
                                            <FaTrash
                                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                onClick={() => handleTrashClick(post.id)}
                                            />
                                            <FaEdit
                                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                onClick={() => handleEditClick(post)}
                                            />
                                        </div>

                                    </div>

                                )}

                            </div>
                        ))
                    ) : (
                        <div>No posts match your search criteria</div>
                    )}
                </>
            )}
            <Outlet />

        </div>

    );
}
