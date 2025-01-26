import {
  deletePost,
  likePost,
  unlikePost,
  updatePost,
} from "@/features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { Post } from "./../../../../backend/src/types/Post";
import PostCard from "./PostCard";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLike = () => {
    if (post.islikedbyuser) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(post.id));
    }
  };

  const handleUpdate = (title: string, content: string) => {
    dispatch(updatePost({ postId: post.id, title, content }));
  };

  return (
    <PostCard
      post={post}
      onLike={handleLike}
      onClick={() => navigate(`/post/${post.id}`)}
      onDelete={user?.id === post.userid ? handleDelete : undefined}
      onUpdate={handleUpdate}
      userId={user?.id || null}
    />
  );
};

export default PostItem;
