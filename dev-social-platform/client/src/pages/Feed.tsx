import CreatePost from "@/components/Post/CreatePost";
import PostList from "@/components/Post/PostList";
import useFetchFeed from "@/hooks/useFetchFeed";
const Feed = () => {
  const { user, posts, loading, error } = useFetchFeed("normal");

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {user ? (
        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Welcome {user.username}!</p>
          <h1 className="text-3xl font-bold mt-2">Feed</h1>
          <p className="text-gray-500">My id: {user.id}</p>
          <p className="text-gray-500">My Email: {user.email}</p>
        </div>
      ) : (
        <p className="text-center text-red-500">
          User not found. Please log in.
        </p>
      )}
      <CreatePost postType="normal" />
      <PostList posts={posts} />
    </div>
  );
};

export default Feed;
