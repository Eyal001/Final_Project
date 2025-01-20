import { Request, Response } from "express";
import { postModel } from "../models/postModel";
import { Post } from "../types/Post";

export const postController = {
  createPost: async (req: Request, res: Response): Promise<void> => {
    const { title, content, posttype } = req.body;
    const userid = (req as any).user?.id;
    if (!userid || !title || !posttype) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    try {
      const newPost: Post = await postModel.createPost(
        userid,
        title,
        content || "",
        posttype
      );
      res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
      return;
    } catch (error) {
      console.error("Error creating post: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const posts: Post[] = await postModel.getAllPosts();
      res.status(200).json(posts);
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  getPostById: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    try {
      const post = await postModel.getPostById(Number(postId));
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
      res.status(200).json(post);
      return;
    } catch (error) {
      console.error("Error fetching post: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  getPostsByType: async (req: Request, res: Response): Promise<void> => {
    const { postType } = req.params;
    if (postType !== "normal" && postType !== "question") {
      res.status(400).json({ message: "Invalid post type" });
      return;
    }
    try {
      const posts = await postModel.getPostsByType(
        postType as "normal" | "question"
      );
      res.status(200).json(posts);
      return;
    } catch (error) {
      console.error("Error fetching posts by type: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  updatePost: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const updates: Partial<Post> = req.body;
    try {
      const updatedPost = await postModel.updatePost(Number(postId), updates);
      if (!updatedPost) {
        res.status(404).json({ message: "Post not found or update failed" });
        return;
      }
      res
        .status(200)
        .json({ message: "Post updated successfully", post: updatedPost });
      return;
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  deletePost: async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    try {
      await postModel.deletePost(Number(postId));
      res.status(200).json({ message: "Post deleted successfully" });
      return;
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },
};
