import { useContext, useEffect, useState } from "react";
import { UserContext } from "./posts";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

export default function SpecificPost() {
    const { email } = JSON.parse(localStorage.getItem("currentUser"));
    const post = useContext(UserContext);
    const { id } = useParams();
    const {
        setSelectedPost,
        editingPost,
        setEditingPost,
        titleRef,
        bodyRef,
        setUserPosts,
    } = useOutletContext();
    const [comments, setComments] = useState(false);
    const [userComments, setUserComments] = useState([]);
    const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentBody, setEditingCommentBody] = useState("");

    const navigate = useNavigate();
    const [newComment, setNewComment] = useState({
        postId: post.id,
        name: "",
        email: email,
        body: "",
    });

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/comments?postId=${post.id}`
                );
                
                const data = await response.json();
                console.log(data);
                
                setUserComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        if (comments) {
            fetchComments();
        }
    }, [id, comments]);

    const handleClose = () => {
        setSelectedPost(null);
        navigate(`/home/${id}/posts`);
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
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
                setUserPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === id ? { ...post, title: newTitle, body: newBody } : post
                    )
                );
                setEditingPost(null);
                handleClose();
            } else {
                console.error(
                    "Error updating post:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const showComments = () => {
        setComments(true);
    };

    const closeShowComments = () => {
        setComments(false);
    };

    const addCommentToServer = async () => {
        try {
            const response = await fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            if (response.ok) {
                const addedComment = await response.json();
                setUserComments((prevComments) => [...prevComments, addedComment]);
                setIsAddCommentOpen(false);
                setNewComment({
                    postId: post.id,
                    name: newComment.name,
                    email: newComment.email,
                    body: "",
                });
            } else {
                console.error(
                    "Failed to add comment:",
                    response.status,
                    response.statusText
                );
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setUserComments((prevComments) =>
                    prevComments.filter((comment) => comment.id !== commentId)
                );
            } else {
                console.error("Error deleting comment:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleEditComment = async () => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${editingCommentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: post.id,
                    name: newComment.name,
                    email: newComment.email,
                    body: editingCommentBody
                }),
            });

            if (response.ok) {
                setUserComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.id === editingCommentId ? { ...comment, body: editingCommentBody } : comment
                    )
                );
                setEditingCommentId(null);
                setEditingCommentBody("");
            } else {
                console.error("Error editing comment:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const addCommentClicked = () => {
        setIsAddCommentOpen(true);
    };

    const handleAddNameCommentInput = (e) => {
        const { value } = e.target;
        setNewComment((prevState) => ({
            ...prevState,
            name: value,
        }));
    };

    const handleAddBodyCommentInput = (e) => {
        const { value } = e.target;
        setNewComment((prevState) => ({
            ...prevState,
            body: value,
        }));
    };

    const handleEditBodyInputChange = (e) => {
        setEditingCommentBody(e.target.value);
    };

    return editingPost && editingPost.id === post.id ? (
        <div>
            {post.id}
            <input type="text" defaultValue={post.title} ref={titleRef} />
            <input type="text" defaultValue={post.body} ref={bodyRef} />
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
            <FaTimes onClick={handleClose} />
            {post.id}
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={showComments}>Show comments</button>
            <FaEdit
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={() => handleEditClick(post)}
            />
            {comments && (
                <div>
                    <FaTimes onClick={closeShowComments} />
                    <button onClick={addCommentClicked}>Add comment</button>
                    <h4>Comments:</h4>
                    {isAddCommentOpen && (
                        <div>
                            <FaTimes onClick={() => setIsAddCommentOpen(false)} />
                            <input
                                name="body"
                                onChange={handleAddBodyCommentInput}
                                type="text"
                                value={newComment.body}
                                placeholder="Add body..."
                            />
                            <input
                                name="name"
                                onChange={handleAddNameCommentInput}
                                type="text"
                                value={newComment.name}
                                placeholder="Add name..."
                            />
                            <button onClick={addCommentToServer}>Save comment</button>
                        </div>
                    )}
                    {userComments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            {editingCommentId === comment.id ? (
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={comment.body}
                                        onChange={handleEditBodyInputChange}
                                    />
                                    <button onClick={handleEditComment}>Save</button>
                                    <FaTimes onClick={() => setEditingCommentId(null)} />
                                </div>
                            ) : (
                                <div>
                                    <p>{comment.body}</p>
                                    {comment.email === email && (
                                        <div>
                                            <FaEdit
                                                onClick={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditingCommentBody(comment.body);
                                                }}
                                            />
                                            <FaTrash onClick={() => deleteComment(comment.id)} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
