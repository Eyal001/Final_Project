import { Request, Response } from "express";
import { likePostModel } from "../models/likePostModel";

export const likePostController = {
  addLike: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { postId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      await likePostModel.addLike(userId, Number(postId));
      res.status(201).json({ message: "Like added successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error adding like" });
    }
  },
  removeLike: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { postId } = req.params;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    try {
      await likePostModel.removeLike(userId, Number(postId));
      res.status(200).json({ message: "Like removed successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error removing like" });
    }
  },
  getLikesCount: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
      const count = await likePostModel.getLikeCount(Number(postId));
      res.status(200).json({ postId, likes: count });
      return;
    } catch (error) {
      res.status(400).json({ message: "Error getting like count" });
    }
  },
  checkUserLike: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { postId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const isLiked = await likePostModel.checkUserLike(userId, Number(postId));
      res.status(200).json({ postId, liked: isLiked });
    } catch (error) {
      res.status(400).json({ message: "Error checking user like" });
    }
  },
};
