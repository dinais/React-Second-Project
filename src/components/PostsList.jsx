import { Link, Outlet } from "react-router-dom";
import { FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { deleteResource } from "./ServerRequests"
export function PostsList(props) {
    const { postsArray, filtered, userPosts, setUserPosts, selectedPost, setSelectedPost,allPostsVisible } = props;
    const handleTrashClick = async (id) => {
        try {
            await deleteResource(id, "posts");
            setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));

        } catch (error) {
            console.error("Error deleting todo:", error.message);
        }
  
    };
    return (
        <>
            {postsArray.length > 0 ? (
                postsArray.map((post) => (
                    <div key={post.id} className="post-item">
                        <div>
                            {selectedPost?.id == post.id ? (
                                <Outlet context={{ userPosts, setUserPosts, selectedPost, setSelectedPost,allPostsVisible }} />
                            ) : (
                                <>
                                    {post.id}
                                    <div>{post.title}</div>
                                    <Link to={`${post.id}`} onClick={() => setSelectedPost(post)} className="show">
                                        Show post
                                    </Link>
                                    {!allPostsVisible&&<FaTrash
                                        style={{ marginRight: '10px', cursor: 'pointer' }}
                                        onClick={() => handleTrashClick(post.id)}
                                    />}
                                </>
                            )}
                        </div>
                    </div>
                ))
            )
                : filtered ? (
                    <div>No posts match your search criteria</div>
                ) : (
                    <div>You do not have any posts, create some!</div>
                )
            }
        </>
    );

}
PostsList.propTypes = {
    postsArray: PropTypes.array.isRequired,
    filtered: PropTypes.bool.isRequired,
    userPosts: PropTypes.array.isRequired,
    setUserPosts: PropTypes.func.isRequired,
    selectedPost: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        body: PropTypes.string,
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    setSelectedPost: PropTypes.func.isRequired,
    allPostsVisible:PropTypes.bool.isRequired
};
