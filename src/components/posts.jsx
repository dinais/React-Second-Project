import { useEffect, useState, createContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import './style.css';
import { SearchPosts, AddNewPost } from "./PostsActions"
import { PostsList } from "./PostsList";
import { fetchResource } from "./ServerRequests"
import { PostsActionsBar } from "./PostsActionsBar";
const UserContext = createContext();
export { UserContext }
export default function Posts() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchType, setSearchType] = useState("id");
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);
    const [isSearchPostOpen, setIsSearchPostOpen] = useState(false);
    const [criterion, setCriterion] = useState('id');
    const [selectedPost, setSelectedPost] = useState(null);
    const [allPostsVisible, setAllPostsVisible] = useState(false);


    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const queryString = queryParams.toString();
        const fetchPosts = async () => {
            try {
                let data;
                if (!allPostsVisible) {
                    data = await fetchResource(id, 'posts', 'userId', queryString);
                } else {
                    data = await fetchResource(id, 'posts');
                }
                setUserPosts(data);
                setFilteredPosts(data)
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [id, location, allPostsVisible]);


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

    const searchPostClicked = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('search');
        queryParams.set(searchType, '');
        navigate({ search: queryParams.toString() });
        setIsSearchPostOpen(true);
        console.log('search clicked');

    };


    return (
        <>
            <div className="content-container">
            <h1>Posts</h1>
            {
                <>
                    <PostsActionsBar setIsAddPostOpen={setIsAddPostOpen}
                        searchPostClicked={searchPostClicked}
                        handleChangeSort={handleChangeSort}
                        allPostsVisible={allPostsVisible}
                        setAllPostsVisible={setAllPostsVisible} />
                    {isAddPostOpen && (
                        <AddNewPost
                            id={id}
                            setIsAddPostOpen={setIsAddPostOpen}
                            setUserPosts={setUserPosts}
                            sortItems={sortItems}
                            criterion={criterion}
                        />
                    )}
                    {isSearchPostOpen && (
                        <SearchPosts setFilteredPosts={setFilteredPosts} userPosts={userPosts} setIsSearchPostOpen={setIsSearchPostOpen} searchType={searchType} setSearchType={setSearchType} />
                    )}
                    <PostsList postsArray={isSearchPostOpen ? filteredPosts : userPosts}
                        filtered={isSearchPostOpen}
                        userPosts={userPosts}
                        setUserPosts={setUserPosts}
                        selectedPost={selectedPost}
                        setSelectedPost={setSelectedPost}
                        allPostsVisible={allPostsVisible} />

                </>
            }
            </div>
        </>
    );

}
