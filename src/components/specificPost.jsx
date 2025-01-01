import { useContext } from "react";
import { useEffect, useState } from "react";
import { UserContext } from "./posts"
import { FaEdit, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';

export default function SpecificPost() {
    const post = useContext(UserContext);
    const { id } = useParams();
    const { setSelectedPost, editingPost, setEditingPost, titleRef, bodyRef, setUserPosts } = useOutletContext();
    const [comments, setComments] = useState(false);
    const [userComments, setUserComments] = useState([]);
    const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({ postId: id, name: "", body: "" });


    const navigate = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:3000/comments?postId=${id}`);
                const data = await response.json();
                setUserComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        if (comments) {
            fetchComments();
        }
    }, [id, comments]);

    const handleClose = () => {
        setSelectedPost(null)
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
                handleClose()
            } else {
                console.error("Error updating post:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const showComments = (id) => {
        setComments(true);
    };

    const CloseShowComments = () => {
        setComments(false);
    };
    const addComment = () => {
        if (newComment.name !== "") {
            addCommentToServer();
        }
    };
    const addCommentToServer = async () => {
        const response = await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newComment),
        });
        const addedPost = await response.json();
        console.log(addedPost);
        if (response.ok) {
            setUserComments([...userComments, addComment] )
            //    [...prevComment, addComment];
                // return sortItems(criterion, updatedComment);
           
            setIsAddCommentOpen(false)
            setNewComment({ userId: id, name: "" });
        }
    };
    const addCommentClicked = () => {
        setIsAddCommentOpen(true);
    };
    const handleAddNameCommentInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewComment((prevState) => ({
            ...prevState,
            name: value
        }));
    };

    const handleAddBodyCommentInput = (e) => {
        const { value } = e.target;
        console.log(value);

        setNewComment((prevState) => ({
            ...prevState,
            body: value
        }));
    };
    return (
        editingPost && editingPost.id === post.id ? (
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
                <FaTimes onClick={handleClose} />
                {post.id}
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <button onClick={() => showComments(post.id)}>Show comments</button>
                <FaEdit
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                    onClick={() => handleEditClick(post)}
                />
                {comments && <div>
                    <FaTimes onClick={CloseShowComments} />
                    <button onClick={addCommentClicked}>Add post</button>
                    <h4>Comments:</h4>
                    {isAddCommentOpen && (
                        <div>
                            <FaTimes onClick={() => setIsAddCommentOpen(false)} />
                            <input name="name" onChange={handleAddNameCommentInput} type="text" value={newComment.name} placeholder="Add name..." />
                            <input name="body" onChange={handleAddBodyCommentInput} type="text" value={newComment.body} placeholder="Add body..." />
                            <button onClick={addComment}>Save post</button>
                        </div>
                    )}
                    {userComments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <p>{comment.body}</p>

                        </div>
                    ))}
                </div>}
            </div>
        )
    );
}
