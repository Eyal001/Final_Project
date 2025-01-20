import express from "express";
import { postController } from "../controllers/postController";
import { authorizePostOwner } from "../middlewares/authorizePostOwner";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verifyToken, postController.createPost);

router.get("/", verifyToken, postController.getAllPosts);

router.get("/:postId", verifyToken, postController.getPostById);

router.get("/type/:postType", verifyToken, postController.getPostsByType);

router.delete(
  "/:postId",
  verifyToken,
  authorizePostOwner,
  postController.deletePost
);

router.put(
  "/:postId",
  verifyToken,
  authorizePostOwner,
  postController.updatePost
);

export default router;
