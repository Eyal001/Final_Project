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

  // Verify authentication and refresh token
  verifyAuth: (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { username, id, email, profilepicture } = req.user;
    const { ACCESS_TOKEN_SECRET } = process.env;

    if (!ACCESS_TOKEN_SECRET) {
      res.status(500).json({
        message: "Access token secret is not defined in environment variables",
      });
      return;
    }

    const newAccessToken = jwt.sign(
      { username, id, email, profilepicture },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Verified",
      user: { username, id, email, profilepicture },
      token: newAccessToken,
    });
    console.log("User being sent to frontend: ", {
      username,
      id,
      email,
      profilepicture,
    });

    return;
  },
};
