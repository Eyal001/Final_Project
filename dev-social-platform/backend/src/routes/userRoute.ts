import express from "express";
import { userController } from "../controllers/userController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

/**
 * Public Routes
 */
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // Connexion
router.post("/logout", verifyToken, userController.logoutUser); // Déconnexion

/**
 * Protected Routes
 */
router.get("/me", verifyToken, userController.verifyAuth); // Récupérer les informations utilisateur

router.get("/all", verifyToken, userController.getUsers); // Récupérer tous les utilisateurs (protégé)

export default router;
