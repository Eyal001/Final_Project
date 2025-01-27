import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedPost,
  deletePost,
  getPostById,
  likePost,
  unlikePost,
  updatePost,
} from "../../redux/slices/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import CommentList from "../Comment/CommentList";
import PostCard from "./PostCard";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedPost, loading, error } = useAppSelector(
    (state) => state.posts
  );
  const { user } = useAppSelector((state) => state.auth);

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
    dispatch(
      selectedPost.islikedbyuser
        ? unlikePost(selectedPost.id)
        : likePost(selectedPost.id)
    );
  };

  const confirmAndDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(selectedPost.id));
      navigate(-1);
    }
  };

  const handleUpdate = (title: string, content: string) => {
    dispatch(updatePost({ postId: selectedPost.id, title, content }));
  };

  return (
    <div className="py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-500 hover:underline"
      >
        ← Back
      </button>
      <PostCard
        post={selectedPost}
        onLike={handleLike}
        onDelete={
          user?.id === selectedPost.userid ? confirmAndDelete : undefined
        }
        onUpdate={handleUpdate}
        userId={user?.id || null}
        isDetailedView
      />
      <CommentList postId={selectedPost.id} />
    </div>
  );
};

export default PostDetail;
