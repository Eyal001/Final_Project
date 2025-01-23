import { db } from "../db/db";
import { Comment } from "../types/Comment";

export const commentModel = {
  addComment: async (
    userid: number,
    postid: number,
    content: string
  ): Promise<Comment | null> => {
    try {
      const [comment] = await db<Comment>("comments").insert(
        {
          userid,
          postid,
          content,
        },
        ["id", "userid", "postid", "content", "createdat"]
      );
      return comment;
    } catch (error) {
      console.error("Error adding comment: ", error);
      return null;
    }
  },
  getCommentsByPostId: async (postid: number): Promise<Comment[]> => {
    try {
      const comments = await db<Comment>("comments")
        .join("users", "users.id", "comments.userid")
        .select(
          "comments.id",
          "comments.userid",
          "comments.postid",
          "comments.content",
          "comments.createdat",
          "users.username",
          "users.profilepicture"
        )
        .where("comments.postid", postid)
        .orderBy("comments.createdat", "desc");
      return comments;
    } catch (error) {
      console.error("Error retrieving comments:", error);
      return [];
    }
  },
  deleteComment: async (id: number): Promise<number> => {
    try {
      const deletedRows = await db("comments").where({ id }).del();
      return deletedRows;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  },
};
