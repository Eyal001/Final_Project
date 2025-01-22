import express from "express";
import { likePostController } from "../controllers/likePostController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

router.post("/:postId", verifyToken, likePostController.addLike);
router.delete("/:postId", verifyToken, likePostController.removeLike);
router.get("/:postId/count", likePostController.getLikesCount);
router.get("/:postId/user-like", verifyToken, likePostController.checkUserLike);

export default router;
