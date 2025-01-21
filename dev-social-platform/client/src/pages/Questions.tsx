import CreatePost from "@/components/Post/CreatePost";
import PostList from "@/components/Post/PostList";
import useFetchFeed from "@/hooks/useFetchFeed";

const Questions = () => {
  const { user, posts, loading, error } = useFetchFeed("question");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {user && (
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Welcome {user.username}!</p>
          <h1 className="text-3xl font-bold mt-2">Questions</h1>
        </div>
      )}
      <CreatePost postType="question" />
      <PostList posts={posts} />
    </div>
  );
};

export default Questions;
