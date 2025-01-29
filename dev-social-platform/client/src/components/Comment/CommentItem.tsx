import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import {
  deleteComment,
  likeComment,
  unlikeComment,
  updateComment,
} from "@/redux/slices/comments/commentsSlice";
import { useAppDispatch } from "@/redux/store";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import TextWithCode from "./TextWithCode";
interface CommentItemProps {
  comment: {
    id: number;
    userid: number;
    profilepicture?: string | undefined;
    username?: string;
    content: string;
    createdat: Date;
    likecount?: number | undefined;
    islikedbyuser?: boolean | undefined;
  };
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(comment.content);

  const handleSave = () => {
    dispatch(updateComment({ commentId: comment.id, content: updatedContent }));
    setIsEditing(false);
  };

  const handleLike = () => {
    if (comment.islikedbyuser) {
      dispatch(unlikeComment(comment.id));
    } else {
      dispatch(likeComment(comment.id));
    }
  };

  return (
    <div className="border-b border-gray-700 py-2">
      <div className="flex items-center justify-between text-sm mb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.profilepicture} alt="Profile" />
            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">{user?.username}</span>
        </div>

        {user?.id === comment.userid && (
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(deleteComment(comment.id))}
              className="text-red-500 hover:text-red-700"
            >
              <X />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Pencil />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col">
          <Textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-800 text-white mb-2 h-auto min-h-[300px]"
          />
          <button
            onClick={handleSave}
            className="mt-1 px-4 py-2 bg-green-500 text-white rounded-lg self-end"
          >
            Save
          </button>
        </div>
      ) : (
        <TextWithCode content={comment.content ?? ""} />
      )}

      <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
        <span>
          Posted on {new Date(comment.createdat).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`${
              comment.islikedbyuser ? "text-red-500" : "text-gray-400"
            } hover:text-red-700`}
          >
            {comment.islikedbyuser ? <FaHeart /> : <FaRegHeart />}
          </button>
          <span>{comment.likecount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
