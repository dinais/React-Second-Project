import { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { createResource } from "./ServerRequests"
export function EditComment(props) {
    const { comment, handleUpdateClick, setEditingComment } = props;
    const bodyRef = useRef();
    return (
        <div>
            <FaTimes onClick={() => setEditingComment(null)} />
            <input type="text" defaultValue={comment.body} ref={bodyRef} />
            <button
                onClick={() =>
                    handleUpdateClick(
                        comment.id,
                        bodyRef.current.value
                    )
                }
            >
                Save
            </button>
        </div>
    )
}
EditComment.propTypes = {
    comment: PropTypes.shape({
        id:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    handleUpdateClick: PropTypes.func.isRequired,
    setEditingComment: PropTypes.func.isRequired,
};

export function AddNewComment(props) {
    const { id, setIsAddCommentOpen, setComments, email } = props;
    const [newComment, setNewComment] = useState({ postId: id, name: "", body: "", email: email });
    const newName = useRef(null)
    const newBody = useRef(null)
    const handleAddComment = () => {
        if (newName != null && newName !== ""&&newBody != null && newBody !== "")
            processNewComment();
    }
    const processNewComment = async () => {
        try {
            const addedComment = await createResource("comments", newComment);
            setComments((prevComments) => {
                const updatedComments = [...prevComments, addedComment];
                return updatedComments;
            });
            setIsAddCommentOpen(false);
            setNewComment({ postId: id, name: "", body: "", email: email });

        } catch (error) {
            console.error("Error adding comment:", error.message);
        }
    };
    const handleAddCommentInput = (e) => {
        const { name, value } = e.target; 
        setNewComment((prevState) => ({
            ...prevState,
            [name]: value, 
        }));
    };

    return (<div>
        <FaTimes onClick={() => setIsAddCommentOpen(false)} />
        <input name="name" onChange={handleAddCommentInput} ref={newName} type="text" value={newComment.name} placeholder="Add name to your comment..." />
        <input name="body" onChange={handleAddCommentInput} ref={newBody} type="text" value={newComment.body} placeholder="Add body to your comment..." />
        <button onClick={handleAddComment}>Save comment</button>
    </div>)
}
AddNewComment.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setIsAddCommentOpen: PropTypes.func.isRequired,
    setComments: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired
};