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
      .join("users", "posts.userid", "=", "users.id")
      .select(
        "posts.id",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture"
      )
      .orderBy("posts.createdat", "desc");
  },

  getPostById: async (postId: number): Promise<any | undefined> => {
    return await db("posts")
      .join("users", "posts.userid", "=", "users.id")
      .select(
        "posts.id",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture"
      )
      .where("posts.id", postId)
      .first();
  },

  getPostsByType: async (postType: "normal" | "question"): Promise<any[]> => {
    return await db("posts")
      .join("users", "posts.userid", "=", "users.id")
      .select(
        "posts.id",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture"
      )
      .where("posts.posttype", postType)
      .orderBy("posts.createdat", "desc");
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
