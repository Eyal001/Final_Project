import bcrypt from "bcrypt";
import { db } from "../db/db";
import { User } from "../types/User";

export const userModel = {
  createUser: async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {
    const trx = await db.transaction();
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      const [user] = await trx<User>("users").insert(
        {
          username: username,
          email: email.toLowerCase(),
          password: hashPassword,
        },
        ["id", "username", "email"]
      );
      await trx.commit();
      return user;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw error;
    }
  },
  getUserByEmail: async (email: string): Promise<User | undefined> => {
    try {
      const user = await db<User>("users")
        .select("id", "username", "email", "password", "profilepicture")
        .where({ email: email.toLowerCase() })
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const users = await db<User>("users").select(
        "id",
        "username",
        "email",
        "profilepicture"
      );
      return users;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id: number): Promise<User | undefined> => {
    try {
      const user = await db<User>("users")
        .select("id", "username", "email", "profilepicture")
        .where({ id })
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },
};
