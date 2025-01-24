import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommentItem = ({ comment }) => {
  return (
    <div key={comment.id} className="border-b border-gray-700 py-2">
      <div className="flex items-center gap-4 mb-3 text-sm">
        <Avatar>
          <AvatarImage src={comment.profilepicture} alt="Profile" />
          <AvatarFallback>{comment.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-lg">{comment.username}</span>
      </div>
      <p>{comment.content}</p>
      <span className="text-sm text-gray-400">
        Posted on {new Date(comment.createdat).toLocaleDateString()}
      </span>
    </div>
  );
};
export default CommentItem;
