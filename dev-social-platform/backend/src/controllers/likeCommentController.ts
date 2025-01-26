import { Request, Response } from "express";
import { likeCommentModel } from "../models/likeCommentModel";

export const likeCommentController = {
  likeComment: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { commentId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      await likeCommentModel.likeComment(userId, Number(commentId));
      res.status(200).json({ message: "Comment liked successfully" });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  unlikeComment: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { commentId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      await likeCommentModel.unlikeComment(userId, Number(commentId));
      res.status(200).json({ message: "Comment unliked successfully" });
    } catch (error) {
      console.error("Error unliking comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getCommentLikesCount: async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    try {
      const count = await likeCommentModel.getLikesCount(Number(commentId));
      res.status(200).json({ commentId, likes: count });
    } catch (error) {
      console.error("Error getting like count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
