import express from "express";
import { userController } from "../controllers/userController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

/**
 * Public Routes
 */
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", verifyToken, userController.logoutUser);

/**
 * Protected Routes
 */
router.get("/me", verifyToken, userController.verifyAuth);

router.get("/all", verifyToken, userController.getUsers);

router.put("/update-profile", verifyToken, userController.updateProfile);

export default router;
