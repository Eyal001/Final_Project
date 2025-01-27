import { fetchPostsByType } from "@/redux/slices/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";

const useFetchFeed = (postType: "normal" | "question") => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsByType(postType));
  }, [dispatch, postType]);

  return { posts, loading, error };
};

export default useFetchFeed;
