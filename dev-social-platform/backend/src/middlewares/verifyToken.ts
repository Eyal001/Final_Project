import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const { ACCESS_TOKEN_SECRET } = process.env;

interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: number; email: string };
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
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};

export default verifyToken;
