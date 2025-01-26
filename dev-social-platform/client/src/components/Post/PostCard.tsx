import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Post } from "../../../../backend/src/types/Post";

interface PostCardProps {
  onClick?: () => void;
  onLike: () => void;
  onDelete?: () => void;
  onUpdate: (title: string, content: string) => void;
  post: Post;
  userId: number | null;
  isDetailedView?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDelete,
  onClick,
  onUpdate,
  userId,
  isDetailedView = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content || "");

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(title, content);
    setIsEditing(false);
  };

  return (
    <div
      onClick={isEditing ? undefined : onClick}
      className={`border border-border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-zinc-900 transition ${
        isDetailedView ? "max-w-2xl mx-auto p-6" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={post.profilepicture} alt="Profile" />
            <AvatarFallback>{post.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">{post.username}</span>
        </div>

        {userId === post.userid && (
          <div className="flex gap-2">
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                <X />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
              className="text-blue-500 hover:text-blue-700 text-xl"
            >
              <Pencil />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-800 text-white mb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-800 text-white"
          />
          <button
            onClick={handleSave}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Save
          </button>
        </>
      ) : (
        <>
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
        </>
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
        <span>{post.likecount}</span>
        {!isDetailedView && (
          <span className="ml-4 text-gray-400">💬 {post.commentcount}</span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
