import { fetchCurrentUser } from "@/redux/slices/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          console.error("User not authenticated, redirecting...");
          navigate("/login");
        });
    }
  }, [user, dispatch, navigate]);

  return { user, loading, error };
};

export default useAuth;
