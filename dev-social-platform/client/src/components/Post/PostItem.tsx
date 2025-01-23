import { likePost, unlikePost } from "@/features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { Post } from "./../../../../backend/src/types/Post";
import PostCard from "./PostCard";
interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((state) => state.posts);
  const navigate = useNavigate();
  console.log(posts);

  const handleLike = () => {
    if (post.islikedbyuser) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  return (
    <PostCard
      post={post}
      onLike={handleLike}
      onClick={() => navigate(`/post/${post.id}`)}
    />
  );
};

export default PostItem;
