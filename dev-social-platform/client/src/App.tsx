import { Navigate, Route, Routes } from "react-router-dom";
import PostDetail from "./components/Post/PostDetail";
import Logo from "./components/Shared/Logo";
import Navbar from "./components/Shared/Navbar";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import ProfilePage from "./pages/ProfilePage";
import Questions from "./pages/Questions";
import Register from "./pages/Register";

const App = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      {user && <Navbar />}
      <main className="w-full max-w-6xl mx-auto">
        <Logo />
        <Routes>
          {/* If user is logged in, redirect to /feed, otherwise to /login */}
          <Route
            path="/"
            element={user ? <Navigate to="/feed" replace /> : <Login />}
          />

          <Route
            path="/login"
            element={user ? <Navigate to="/feed" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/feed" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Handling non-existent routes */}
          <Route
            path="*"
            element={<Navigate to={user ? "/feed" : "/login"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
