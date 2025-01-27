import CreatePost from "@/components/Post/CreatePost";
import PostList from "@/components/Post/PostList";
import useAuth from "@/hooks/useAuth";
import useFetchFeed from "@/hooks/useFetchFeed";

const Questions = () => {
  const { user, loading: userLoading, error: userError } = useAuth();
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useFetchFeed("question");

  const isLoading = userLoading || postsLoading;
  const error = userError || postsError;

  if (isLoading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {user ? (
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Welcome {user.username}!</p>
          <h1 className="text-3xl font-bold mt-2">Questions</h1>
        </div>
      ) : (
        <p className="text-center text-red-500">
          User not found. Please log in.
        </p>
      )}

      <CreatePost postType="question" />
      <PostList posts={posts} />
    </div>
  );
};

export default Questions;
