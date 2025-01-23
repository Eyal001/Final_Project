import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const { ACCESS_TOKEN_SECRET } = process.env;

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & {
    username: string;
    id: number;
    email: string;
    profilepicture: string;
  };
}

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & {
      username: string;
      id: number;
      email: string;
      profilepicture: string;
    };
    req.user = decoded;
    // console.log("clg from verify token ", req.user);

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};

export default verifyToken;
