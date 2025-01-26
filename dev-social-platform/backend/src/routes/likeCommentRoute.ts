import express from "express";
import { likeCommentController } from "../controllers/likeCommentController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/:commentId/like", verifyToken, likeCommentController.likeComment);

router.delete(
  "/:commentId/unlike",
  verifyToken,
  likeCommentController.unlikeComment
);

router.get(
  "/:commentId/likes",
  verifyToken,
  likeCommentController.getCommentLikesCount
);

export default router;
