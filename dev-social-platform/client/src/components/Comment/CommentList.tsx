import {
  addComment,
  clearComments,
  getCommentsByPostId,
} from "@/redux/slices/comments/commentsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: number;
}

const CommentList: React.FC<CommentSectionProps> = ({ postId }) => {
  const dispatch = useAppDispatch();
  const { comments, loading } = useAppSelector((state) => state.comments);
  const [content, setContent] = useState("");

  useEffect(() => {
    dispatch(getCommentsByPostId(postId));
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, postId]);

  const handleAddComment = () => {
    if (content.trim() !== "") {
      dispatch(addComment({ postid: postId, content }));
      setContent("");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add Comment
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      ) : (
        <p className="text-gray-500">
          No comments yet... Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentList;
