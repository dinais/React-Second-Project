import { useEffect, useState, useRef, createContext } from "react";
import { useParams, useLocation, useNavigate} from "react-router-dom";
import './style.css';
import {SearchPost,PostsList,AddNewPost} from "./postsActions"
const UserContext = createContext();
export { UserContext }
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
    const [selecShowAllPost, setSelecShowAllPost] = useState(false);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQueryFromUrl = queryParams.get('search') || '';
        setSearchQuery(searchQueryFromUrl);
    }, [location]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = !selecShowAllPost ? await fetch(`http://localhost:3000/posts?userId=${id}`) : await fetch(`http://localhost:3000/posts`);
                const data = await response.json();
                setUserPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [id, selecShowAllPost]);

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
    const filteredPosts = !isSearchPost ? userPosts : filterPosts(userPosts)

    return (
        <div className="posts-container">
            <div>
                <h1>Posts</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div>
                            <button onClick={addPostClicked}>Add post</button>
                            <button onClick={searchPostClicked}>Search post</button>
                            <button onClick={() => {
                                setSelecShowAllPost(!selecShowAllPost);
                            }}>Show all</button>
                            <label htmlFor="sort-select">Sort by:</label>
                            <select id="sort-select" onChange={handleChangeSort}>
                                <option value="id">ID</option>
                                <option value="alphabetical">Alphabetical</option>
                                <option value="random">Random</option>
                            </select>
                        </div>
                        {isAddPostOpen && (
                            <AddNewPost
                                setIsAddPostOpen={setIsAddPostOpen}
                                handleAddTitlePostInput={handleAddTitlePostInput}
                                handleAddBodyPostInput={handleAddBodyPostInput}
                                newPost={newPost}
                                addPost={addPost}
                            />
                        )}
                        {isSearchPostOpen && (
                            <SearchPost handleCloseSearch={handleCloseSearch} searchType={searchType} handleSearchTypeChange={handleSearchTypeChange} searchQuery={searchQuery} handleSearchChange={handleSearchChange} handleSearchSubmit={handleSearchSubmit} />
                        )}
                        <PostsList filteredPosts={filteredPosts}
                            selectedPost={selectedPost}
                            setSelectedPost={setSelectedPost}
                            editingPost={editingPost}
                            setEditingPost={setEditingPost}
                            titleRef={titleRef}
                            bodyRef={bodyRef}
                            setUserPosts={setUserPosts}
                            handleTrashClick={handleTrashClick} />
                    </>
                )}
            </div>
        </div>
    );

}
