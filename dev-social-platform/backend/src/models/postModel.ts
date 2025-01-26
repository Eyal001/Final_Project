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

  // getAllPosts: async (): Promise<Post[]> => {
  //   return await db<Post>("posts")
  //     .join("users", "posts.userid", "=", "users.id")
  //     .select(
  //       "posts.id",
  //       "posts.title",
  //       "posts.content",
  //       "posts.posttype",
  //       "posts.createdat",
  //       "users.username",
  //       "users.profilepicture"
  //     )
  //     .orderBy("posts.createdat", "desc");
  // },
  getAllPosts: async (): Promise<Post[]> => {
    const posts = await db("posts")
      .join("users", "posts.userid", "users.id")
      .leftJoin("likes", "posts.id", "likes.postid")
      .select(
        "posts.id",
        "posts.userid",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture",
        db.raw("CAST(COUNT(likes.id) AS INTEGER) as likecount")
      )
      .groupBy("posts.id", "users.id")
      .orderBy("posts.createdat", "desc");
    console.log(posts);
    return posts;
  },

  getPostById: async (
    postId: number,
    userId: number
  ): Promise<any | undefined> => {
    const post = await db("posts")
      .join("users", "posts.userid", "=", "users.id")
      .leftJoin("likes", "posts.id", "likes.postid")
      .select(
        "posts.id",
        "posts.userid",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture",
        db.raw("CAST(COUNT(likes.id) AS INTEGER) as likecount"),
        db.raw(
          `EXISTS (
          SELECT 1 FROM likes 
          WHERE likes.postid = posts.id 
          AND likes.userid = ?
        ) as islikedbyuser`,
          [userId]
        )
      )
      .where("posts.id", postId)
      .groupBy("posts.id", "users.id")
      .first();
    if (post) {
      return {
        ...post,
        likecount: Number(post.likecount) || 0,
        islikedbyuser: post.islikedbyuser ? true : false,
      };
    }
  },

  getPostsByType: async (
    postType: "normal" | "question",
    userid: number
  ): Promise<any[]> => {
    const posts = await db("posts")
      .join("users", "posts.userid", "=", "users.id")
      .leftJoin("likes", "posts.id", "=", "likes.postid")
      .leftJoin("comments", "posts.id", "=", "comments.postid")
      .select(
        "posts.id",
        "posts.userid",
        "posts.title",
        "posts.content",
        "posts.posttype",
        "posts.createdat",
        "users.username",
        "users.profilepicture",
        db.raw("CAST(COUNT(DISTINCT likes.id) AS INTEGER) as likecount"),
        db.raw("CAST(COUNT(DISTINCT comments.id) AS INTEGER) as commentcount"),
        db.raw(
          `EXISTS (
          SELECT 1 FROM likes 
          WHERE likes.postid = posts.id 
          AND likes.userid = ?
        ) as islikedbyuser`,
          [userid]
        )
      )
      .where("posts.posttype", postType)
      .groupBy("posts.id", "users.id", "users.username", "users.profilepicture")
      .orderBy("posts.createdat", "desc");

    return posts.map((post) => ({
      ...post,
      likecount: Number(post.likecount) || 0,
      islikedbyuser: post.islikedbyuser ? true : false,
      commentcount: Number(post.commentcount) || 0,
    }));
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
