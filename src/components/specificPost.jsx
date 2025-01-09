import {useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { useNavigate, useParams, useOutletContext ,Link, Outlet} from "react-router-dom";
import { updateResource } from "./ServerRequests"
import { EditPost } from "./PostsActions";
export default function SpecificPost() {
    const { id } = useParams();
    const {
        userPosts,
        setUserPosts,
        selectedPost,
        setSelectedPost,
        allPostsVisible
    } = useOutletContext();
    const [editingPost, setEditingPost] = useState(null);
    {
        console.log(selectedPost);
    }
    const [showComments, setShowComments] = useState(false);  
    const navigate = useNavigate();


    const handleClose = () => {
        setSelectedPost(null);
        navigate(`/users/${id}/posts`);
    };

    const handleUpdateClick = async (id, updatedTitle, updatedBody) => {
        try {
            const foundPost = userPosts.find((post) => post.id === id);
            const updatedPost = { ...foundPost, completed: !foundPost.completed, ...(updatedTitle !== null && { title: updatedTitle }), };
            const result = await updateResource(id, updatedPost, "posts");
            setUserPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === id) {
                        return updatedTitle || updatedBody ? 
                            { ...post, title: updatedTitle, body: updatedBody } : 
                            result;  // אם יש עדכון, השתמש ב- result (כמו בטודוס)
                    }
                    return post;
                })
            );
            
            console.log(userPosts);
            
            if (updatedTitle && updatedBody)
                setEditingPost(null);
        } catch (error) {
            console.error("Error updating post:", error.message);
        }
    };

    return (<>
        {(editingPost && editingPost.id === selectedPost.id) && <EditPost post={selectedPost} handleUpdateClick={handleUpdateClick} setEditingPost={setEditingPost} />}
        <div>
            <FaTimes onClick={handleClose} />
            {selectedPost.id}
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.body}</p>
            {!allPostsVisible&&<FaEdit
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => setEditingPost(selectedPost)}
            />}
            <br></br>
            {!showComments?(<Link to="comments" 
                  onClick={() => setShowComments(true)} 
                  className="nav-link">
                Show comments
            </Link>):(
                <Outlet context={{ id,postId: selectedPost.id, setShowComments }} />
            )}
        </div>
    </>
    );
}
