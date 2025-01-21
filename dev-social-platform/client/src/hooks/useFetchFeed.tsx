import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { fetchPostsByType } from "../features/posts/postsSlice";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";

const useFetchFeed = (postType: "normal" | "question") => {
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useAppSelector((state: RootState) => state.auth);
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          console.error("Session expired or not authenticated");
          navigate("/login");
        });
    }
  }, [dispatch, navigate, user]);

  useEffect(() => {
    dispatch(fetchPostsByType(postType));
  }, [dispatch, postType]);

  return {
    user,
    posts,
    loading: userLoading || postsLoading,
    error: userError || postsError,
  };
};

export default useFetchFeed;
