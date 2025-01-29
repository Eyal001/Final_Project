import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createPost } from "../../redux/slices/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Button } from "../ui/button";

interface CreatePostProps {
  postType: "normal" | "question";
}

const CreatePost: React.FC<CreatePostProps> = ({ postType }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handlePostSubmit = async () => {
    if (!user || !title.trim() || !postType) {
      alert("Please fill in the required fields.");
      return;
    }

    const newPost = {
      userid: user.id,
      title: title.trim(),
      content: postType === "question" ? content.trim() : "",
      posttype: postType,
    };

    try {
      await dispatch(createPost(newPost)).unwrap();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="p-4 border-b border-border">
      <h2 className="text-xl font-bold mb-2">
        {postType === "normal" ? "What's on your mind?" : "Ask a question"}
      </h2>
      <Textarea
        className="w-full p-2 border rounded-md bg-transparent"
        placeholder={postType === "normal" ? "Write a post..." : "Question"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {postType === "question" && (
        <>
          <Textarea
            className="w-full p-2 mt-2 border rounded-md bg-transparent"
            placeholder="Describe your question...      Use  <code> Your code <code> for highlight"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="mt-4"></div>
        </>
      )}
      <Button
        className="mt-3 px-4 py-2 bg-primary text-black rounded-md disabled:opacity-50"
        onClick={handlePostSubmit}
        disabled={!title.trim()}
      >
        Post
      </Button>
    </div>
  );
};

export default CreatePost;
