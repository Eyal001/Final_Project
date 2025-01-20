import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";

const Feed = () => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  console.log("User from store:", user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate;
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const fetchUser = async () => {
          try {
            await dispatch(fetchCurrentUser()).unwrap();
          } catch {
            console.error("Session expired or not authenticated");
            navigate("/login");
          }
        };
        fetchUser();
      }
    };
    fetchUser();
  }, [dispatch, navigate, user]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {user ? (
        <>
          <p>Welcome {user.username} !</p>
          <h1>Feed</h1>
          <p>My id: {user.id}</p>
          <p>My Email: {user.email}</p>
        </>
      ) : (
        <p>User not found. Please log in.</p>
      )}
    </>
  );
};
export default Feed;
