import { db } from "../db/db";

export const likeCommentModel = {
  likeComment: async (userid: number, commentid: number): Promise<void> => {
    await db("comment_likes").insert({ userid, commentid });
  },

  unlikeComment: async (userid: number, commentid: number): Promise<void> => {
    await db("comment_likes").where({ userid, commentid }).del();
  },

  getLikesCount: async (commentid: number): Promise<number> => {
    const count = await db("comment_likes").where({ commentid }).count();
    return parseInt(String(count[0].count), 10);
  },

  isCommentLikedByUser: async (
    userid: number,
    commentid: number
  ): Promise<boolean> => {
    const result = await db("comment_likes")
      .where({ userid, commentid })
      .first();
    return !!result;
  },
};
