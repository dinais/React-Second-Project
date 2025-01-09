import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchResource, deleteResource, updateResource } from "./ServerRequests";
import { FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import { EditComment, AddNewComment } from "./CommentsActions"
export default function Comments() {
    const { id, postId, setShowComments } = useOutletContext();
    const navigate = useNavigate();
    const { email } = JSON.parse(localStorage.getItem("currentUser"));
    const [comments, setComments] = useState([]);
    const [editingComment, setEditingComment] = useState(null)
    const [isAddCommentOpen, setIsAddCommentOpen] = useState(false)
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const queryString = queryParams.toString();
        const fetchComments = async () => {
            try {
                const data = await fetchResource(postId, 'comments', 'postId', queryString);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [postId, comments]);

    const handleTrashClick = async (id) => {
        try {
            await deleteResource(id, "comments");
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
        } catch (error) {
            console.error("Error deleting comment:", error.message);
        }
    };

    const handleUpdateClick = async (id, updatedBody) => {
        try {
            const foundComment = comments.find((comment) => comment.id === id);
            const updatedComment = { ...foundComment, body: updatedBody };
            const result = await updateResource(id, updatedComment, "comments");
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === id) {
                        return updatedBody !== null ? { ...comment, body: updatedBody } : result;
                    }
                    return comment;
                })
            );
            if (updatedBody)
                setEditingComment(null);
        } catch (error) {
            console.error("Error updating comment:", error.message);
        }
    };

    const handleClose = () => {
        setShowComments(false);
        navigate(`/users/${id}/posts/${postId}`);
    };

    return (<div>
        <FaTimes onClick={handleClose} />
        <h3>Comments:</h3>
        <button onClick={() => setIsAddCommentOpen(true)}>Add comment</button>
        {isAddCommentOpen && <AddNewComment id={postId} setIsAddCommentOpen={setIsAddCommentOpen} setComments={setComments} email={email} />}
        {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
                {
                    <div>
                        <div>{comment.body}</div>
                        {email === comment.email && <div>
                            <FaEdit
                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                onClick={() => setEditingComment(comment)}
                            />
                            {(editingComment != null) && (editingComment.id == comment.id) && <EditComment comment={comment} handleUpdateClick={handleUpdateClick} setEditingComment={setEditingComment} />}
                            <FaTrash
                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                onClick={() => handleTrashClick(comment.id)}
                            />
                        </div>}
                    </div>
                }
            </div>
        ))}
    </div>
    )

}