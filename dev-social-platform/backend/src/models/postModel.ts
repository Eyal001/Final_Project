import { db } from "../db/db";
import { Post } from "../types/Post";

export const postModel = {
  createPost: async (
    userid: number,
    title: string,
    content: string | null,
    posttype: "normal" | "question"
  ): Promise<Post> => {
    const [post] = await db<Post>("posts").insert(
      {
        userid,
        title,
        content: content || undefined,
        posttype,
      },
      ["id", "userid", "title", "content", "posttype", "createdat"]
    );
    return post;
  },

  getAllPosts: async (): Promise<Post[]> => {
    return await db<Post>("posts")
      .select("id", "userid", "title", "content", "posttype", "createdat")
      .orderBy("createdat", "desc");
  },

  getPostById: async (postId: number): Promise<Post | undefined> => {
    return await db<Post>("posts")
      .select("id", "userid", "title", "content", "posttype", "createdat")
      .where({ id: postId })
      .first();
  },

  getPostsByType: async (postType: "normal" | "question"): Promise<Post[]> => {
    return await db<Post>("posts")
      .where({ posttype: postType })
      .select("id", "userid", "title", "content", "posttype", "createdat")
      .orderBy("createdat", "desc");
  },

  deletePost: async (postId: number): Promise<void> => {
    await db("posts").where({ id: postId }).del();
  },

  updatePost: async (
    postId: number,
    updates: Partial<Post>
  ): Promise<Post | undefined> => {
    const [updatedPost] = await db<Post>("posts")
      .where({ id: postId })
      .update(updates, [
        "id",
        "userid",
        "title",
        "content",
        "posttype",
        "createdat",
      ]);
    return updatedPost;
  },
};
