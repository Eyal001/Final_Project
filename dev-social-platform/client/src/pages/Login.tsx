// // import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../redux/store";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPasword] = useState("");
//   const [error, setError] = useState("");
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setError("");
//       await dispatch(loginUser({ email, password })).unwrap();
//       navigate("/feed");
//     } catch (error: any) {
//       console.log("Login error", error);
//       setError(error || "Login failed. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       {error && <p>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPasword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//         {/* <Button type="submit">Login</Button> */}
//       </form>
//       <p>
//         You are not registered ? <Link to="/register">Register here.</Link>
//       </p>
//     </div>
//   );
// };
// export default Login;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
function Login({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/feed");
    } catch (error: any) {
      console.log("Login error", error);
      setError(error || "Login failed. Please try again.");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center"></div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPasword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              {/* <Button type="submit">Login</Button> */}
            </form>
            <p className="pt-3">
              Don't have an account ? <Link to="/register">Sign up.</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default Login;
