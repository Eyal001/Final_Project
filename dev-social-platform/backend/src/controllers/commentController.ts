import { Request, Response } from "express";
import { commentModel } from "../models/commentModel";

export const commentController = {
  addComment: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!postId || !content) {
      res.status(400).json({ message: "Post ID and content are required" });
      return;
    }

    try {
      const comment = await commentModel.addComment(
        userId,
        Number(postId),
        content
      );
      res.status(201).json({ message: "Comment added successfully", comment });
      return;
    } catch (error) {
      console.error("Error adding comment: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },
  updateComment: async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!commentId || !content) {
      res.status(400).json({ message: "Comment ID and content are required" });
      return;
    }

    try {
      const updatedComment = await commentModel.updateComment(
        Number(commentId),
        content
      );

      if (!updatedComment) {
        res.status(404).json({ message: "Comment not found or update failed" });
        return;
      }

      res.status(200).json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
      return;
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  getCommentsByPostId: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = (req as any).user?.id;

    if (!postId) {
      res.status(400).json({ message: "Post ID is required" });
      return;
    }

    try {
      const comments = await commentModel.getCommentsByPostId(
        Number(postId),
        userId
      );
      res.status(200).json(comments);
      return;
    } catch (error) {
      console.error("Error fetching comments: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },
  getCommentsCount: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
      const count = await commentModel.getCommentsCount(Number(postId));
      res.status(200).json({ postId, comments: count });
      return;
    } catch (error) {
      res.status(400).json({ message: "Error getting like count" });
    }
  },
  deleteComment: async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    if (!commentId) {
      res.status(400).json({ message: "Comment ID is required" });
      return;
    }

    try {
      await commentModel.deleteComment(Number(commentId));
      res.status(200).json({ message: "Comment deleted successfully" });
      return;
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },
};
