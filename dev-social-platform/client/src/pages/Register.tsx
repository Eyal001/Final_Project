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
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/auth/authSlice";
import { useAppDispatch } from "../redux/store";

const Register: React.FC = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
        { username, email, password },
        { withCredentials: true }
      );

      await dispatch(loginUser({ email, password })).unwrap();

      navigate("/feed");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Login error", error.message);
        setError(error.message || "registration failed. Please try again.");
      } else {
        console.log("Unexpected error", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col py-5 w-full items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className=" max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your username , email and password below to register to your
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2 pb-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2 pb-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className=" pt-3">
                <Button className="w-full" type="submit">
                  Register
                </Button>
              </div>
            </form>
            <p className="pt-3">
              You have an account ? <Link to="/login">Login here </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
