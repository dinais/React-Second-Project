import { useContext } from "react";
import { UserContext } from "./posts"
import { FaEdit, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';


export default function SpecificPost() {
    const post = useContext(UserContext);
    console.log(post);
    const { id } = useParams();
    const { setSelectedPost, editingpost, setEditingpost, titleRef, bodyRef, setUserposts } = useOutletContext();

    const navigate = useNavigate();

    const handleClose = () => {
        setSelectedPost(null)
        navigate(`/home/${id}/posts`);
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
                setUserposts((prevposts) =>
                    prevposts.map((post) =>
                        post.id === id ? { ...post, title: newTitle, body: newBody } : post
                    )
                );
                setEditingpost(null);
                handleClose()
            } else {
                console.error("Error updating post:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };
    return (
        editingpost && editingpost.id === post.id ? (
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
        ) : (<div>
            <FaTimes onClick={handleClose} />
            {post.id}
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <FaEdit
                style={{ marginLeft: '10px', cursor: 'pointer' }}
                onClick={() => handleEditClick(post)}
            />
        </div>))
}
