import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel";
import { User } from "../types/User";

interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    id: number;
    email: string;
    profilepicture?: string;
  };
}

export const userController = {
  // Register user
  registerUser: async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
      const user = await userModel.createUser(username, email, password);
      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error: any) {
      console.log(error);
      if (error.code === "23505") {
        res.status(400).json({
          message: "Email already exists",
        });
        return;
      } else {
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },

  // Login user
  loginUser: async (req: Request, res: Response): Promise<void> => {
    const { password, email } = req.body;

    try {
      const user: User | undefined = await userModel.getUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        password + "",
        user.password || ""
      );
      if (!passwordMatch) {
        res.status(404).json({ message: "Wrong password" });
        return;
      }

      const { ACCESS_TOKEN_SECRET } = process.env;
      if (!ACCESS_TOKEN_SECRET) {
        res.status(500).json({
          message:
            "Access token secret is not defined in environment variables",
        });
        return;
      }

      /** Generate a token */
      const accessToken = jwt.sign(
        {
          username: user.username,
          id: user.id,
          email: user.email,
          profilepicture: user.profilepicture,
        },
        ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" }
      );

      /** Set the token in httpOnly cookie */
      res.cookie("token", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      /** Response to client */
      res.status(200).json({
        message: "Login Successfully",
        user: {
          username: user.username,
          id: user.id,
          email: user.email,
          profilepicture: user.profilepicture,
        },
        token: accessToken,
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  // Get all users
  getUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userModel.getUsers();
      res.json(users);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  // Logout user
  logoutUser: (req: Request, res: Response): void => {
    res.clearCookie("token");
    req.cookies.token = null;
    delete req.cookies.token;

    res.sendStatus(200);
    return;
  },

  verifyAuth: async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.user;

    try {
      const user = await userModel.getUserById(id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { ACCESS_TOKEN_SECRET } = process.env;
      if (!ACCESS_TOKEN_SECRET) {
        res.status(500).json({
          message:
            "Access token secret is not defined in environment variables",
        });
        return;
      }

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          profilepicture: user.profilepicture,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ message: "Verified", user, token: newAccessToken });
    } catch (error) {
      res.status(500).json({ message: "Error verifying user" });
    }
  },
  updateProfile: async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { username, email, profilePicture, currentPassword, newPassword } =
      req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!currentPassword) {
      res.status(400).json({ message: "Current password is required" });
      return;
    }

    try {
      const user = await userModel.getUserById(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!user.password) {
        res.status(400).json({ message: "User password not found" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        res.status(400).json({ message: "Incorrect password" });
        return;
      }

      const updates: Partial<User> = {
        username,
        email,
        profilepicture: profilePicture,
      };

      if (newPassword) {
        updates.password = newPassword;
      }

      await userModel.updateUserProfile(userId, updates);
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  },
};
