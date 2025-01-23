import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedPost,
  getPostById,
  likePost,
  unlikePost,
} from "../../features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import PostCard from "./PostCard";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedPost, loading, error } = useAppSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(Number(postId)));
    }

    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, postId]);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!selectedPost)
    return <p className="text-center text-gray-500">Post not found.</p>;

  const handleLike = () => {
    if (selectedPost.islikedbyuser) {
      dispatch(unlikePost(selectedPost.id));
    } else {
      dispatch(likePost(selectedPost.id));
    }
  };

  return (
    <div className="py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 hover:underline"
      >
        ← Back
      </button>
      <PostCard post={selectedPost} onLike={handleLike} isDetailedView />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <div className="text-gray-500">Comments section coming soon...</div>
      </div>
    </div>
  );
};

export default PostDetail;
