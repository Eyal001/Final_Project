import express from "express";
import { commentController } from "../controllers/commentController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/:postId", verifyToken, commentController.addComment);

router.get("/:postId", verifyToken, commentController.getCommentsByPostId);

router.put("/:commentId", verifyToken, commentController.updateComment);

router.delete("/:commentId", verifyToken, commentController.deleteComment);

export default router;
