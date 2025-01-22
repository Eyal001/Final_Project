import { db } from "../db/db";
import { LikePost } from "../types/Like";

export const likePostModel = {
  addLike: async (
    userid: number,
    postid: number
  ): Promise<LikePost | undefined> => {
    try {
      const [like] = await db<LikePost>("likes").insert({ userid, postid }, [
        "id",
        "postid",
        "userid",
      ]);
      return like;
    } catch (error) {
      console.error("Error adding like: ", error);
      throw new Error("Error adding like");
    }
  },
  removeLike: async (userid: number, postid: number): Promise<void> => {
    try {
      await db("likes").where({ userid, postid }).del();
    } catch (error) {
      console.error("Error removing like: ", error);
      throw new Error("Error removing like");
    }
  },
  getLikeCount: async (postid: number): Promise<number | undefined> => {
    try {
      const count = await db("likes").where({ postid }).count();
      return parseInt(String(count[0].count));
    } catch (error) {}
  },
  checkUserLike: async (userId: number, postId: number): Promise<boolean> => {
    try {
      const result = await db.raw(
        `SELECT EXISTS (SELECT 1 FROM likes WHERE userid = ? AND postid = ?) AS "exists"`,
        [userId, postId]
      );
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking user like:", error);
      throw new Error("Error checking user like");
    }
  },
};
