import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, LogOut, MessageCircleQuestion, User } from "lucide-react";

import { Link } from "react-router-dom";
import { logoutUser } from "../../redux/slices/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className=" text-white border-border border-t md:border-r md:border-t-0 md:fixed md:left-0 md:top-0 md:h-screen md:w-20 w-full fixed bottom-0 flex md:flex-col flex-row items-center md:py-10 py-3 justify-around">
      <Link to="/feed" className="hover:text-blue-500 transition">
        <Home size={28} />
      </Link>
      <Link to="/questions" className="hover:text-blue-500 transition">
        <MessageCircleQuestion size={28} />
      </Link>
      <Link to="/profile" className="hover:text-blue-500 transition">
        <User size={28} />
      </Link>
      {user && (
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-400 transition"
        >
          <LogOut size={28} />
        </button>
      )}
      <Avatar>
        <AvatarImage src={user?.profilepicture} />
        <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
      </Avatar>
    </nav>
  );
};

export default Navbar;
