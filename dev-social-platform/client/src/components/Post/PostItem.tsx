import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "./../../../../backend/src/types/Post";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className="border border-border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-zinc-900 transition">
      <div className="flex items-center gap-4 mb-3 text-sm">
        <Avatar>
          <AvatarImage src={post.profilepicture} alt="Profile" />
          <AvatarFallback>{post.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{post.username}</span>
      </div>
      <h2 className="text-lg font-bold mb-2 whitespace-pre-wrap break-words">
        {post.title}
      </h2>
      {post.posttype === "question" && (
        <p className="text-gray-200">{post.content}</p>
      )}
      <span className="text-sm text-gray-500 mt-2 block">
        Created • {new Date(post.createdat).toLocaleDateString("en-EN")}
      </span>
    </div>
  );
};

export default PostItem;
