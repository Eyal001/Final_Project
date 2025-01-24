import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Post } from "../../../../backend/src/types/Post";

interface PostCardProps {
  onClick?: () => void;
  onLike: () => void;
  post: Post;
  isDetailedView?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onClick,
  isDetailedView = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`border border-border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-zinc-900 transition ${
        isDetailedView ? "max-w-2xl mx-auto p-6" : ""
      }`}
    >
      <div className="flex items-center gap-4 mb-3 text-sm">
        <Avatar>
          <AvatarImage src={post.profilepicture} alt="Profile" />
          <AvatarFallback>{post.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-lg">{post.username}</span>
      </div>

      <h2
        className={`font-bold mb-2 whitespace-pre-wrap break-words ${
          isDetailedView ? "text-2xl" : "text-lg"
        }`}
      >
        {post.title}
      </h2>

      {post.posttype === "question" && (
        <p className="text-gray-200">{post.content}</p>
      )}

      <span className="text-sm text-gray-500 mt-2 block">
        Posted on {new Date(post.createdat).toLocaleDateString("en-EN")}
      </span>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="text-red-500"
        >
          {post.islikedbyuser ? <FaHeart /> : <FaRegHeart />}
        </button>
        <span>{post.likecount} Likes</span>
        {!isDetailedView && (
          <span className="ml-4 text-gray-400">
            💬 {post.commentcount} Comments
          </span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
