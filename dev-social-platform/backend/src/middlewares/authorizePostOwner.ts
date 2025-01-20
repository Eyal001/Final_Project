import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const authorizePostOwner = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id; // The id of the connected user
    const { postId } = req.params; // id of the post retrieved from url

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const post = await db("posts")
      .select("userid")
      .where({ id: Number(postId) })
      .first(); // check if the user is the owner of the post

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.userid !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
      return;
    }
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
