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
  getCommentsByPostId: async (
    postid: number,
    userid: number
  ): Promise<Comment[]> => {
    try {
      const comments = await db("comments")
        .join("users", "users.id", "comments.userid")
        .leftJoin("comment_likes", "comments.id", "comment_likes.commentid")
        .select(
          "comments.id",
          "comments.userid",
          "comments.postid",
          "comments.content",
          "comments.createdat",
          "users.username",
          "users.profilepicture",
          db.raw("CAST(COUNT(comment_likes.id) AS INTEGER) as likecount"),
          db.raw(
            `EXISTS (
              SELECT 1 FROM comment_likes 
              WHERE comment_likes.commentid = comments.id 
              AND comment_likes.userid = ?
            ) as islikedbyuser`,
            [userid]
          )
        )
        .where("comments.postid", postid)
        .groupBy("comments.id", "users.id")
        .orderBy("likecount", "desc");

      return comments.map((comment) => ({
        ...comment,
        likecount: Number(comment.likecount) || 0,
        islikedbyuser: comment.islikedbyuser ? true : false,
      }));
    } catch (error) {
      console.error("Error retrieving comments:", error);
      return [];
    }
  },
  updateComment: async (
    id: number,
    content: string
  ): Promise<Comment | null> => {
    try {
      const [updatedComment] = await db<Comment>("comments")
        .where({ id })
        .update({ content }, [
          "id",
          "userid",
          "postid",
          "content",
          "createdat",
        ]);

      return updatedComment || null;
    } catch (error) {
      console.error("Error updating comment: ", error);
      return null;
    }
  },
  getCommentsCount: async (postid: number): Promise<number | undefined> => {
    try {
      const count = await db("comments").where({ postid }).count();
      return parseInt(String(count[0].count));
    } catch (error) {}
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
