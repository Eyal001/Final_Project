import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Post } from "../../../../../backend/src/types/Post";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

export const fetchPostsByType = createAsyncThunk<
  Post[],
  "normal" | "question",
  { rejectValue: string }
>("posts/fetchPostsByType", async (postType, thunkAPI) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/api/posts/type/${postType}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to fetch posts"
    );
  }
});

export const getPostById = createAsyncThunk<
  Post,
  number,
  { rejectValue: string }
>("posts/getPostById", async (postid, thunkAPI) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/posts/${postid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to fetch posts"
    );
  }
});

export const deletePost = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("posts/deletePost", async (postId, thunkAPI) => {
  try {
    await axios.delete(`${apiBaseUrl}/api/posts/${postId}`, {
      withCredentials: true,
    });
    return postId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to delete posts"
    );
  }
});

export const updatePost = createAsyncThunk<
  Post,
  { postId: number; title: string; content: string },
  { rejectValue: string }
>("posts/updatePost", async ({ postId, title, content }, thunkAPI) => {
  try {
    const response = await axios.put(
      `${apiBaseUrl}/api/posts/${postId}`,
      { title, content },
      { withCredentials: true }
    );
    return response.data.post;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to update posts"
    );
  }
});

export const likePost = createAsyncThunk<
  { postid: number },
  number,
  { rejectValue: string }
>("posts/likePost", async (postid, thunkAPI) => {
  try {
    await axios.post(
      `${apiBaseUrl}/api/post-likes/${postid}`,
      {},
      { withCredentials: true }
    );
    return { postid };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error liking post"
    );
  }
});

export const unlikePost = createAsyncThunk<
  { postid: number },
  number,
  { rejectValue: string }
>("posts/unlikePost", async (postid, thunkAPI) => {
  try {
    await axios.delete(`${apiBaseUrl}/api/post-likes/${postid}`, {
      withCredentials: true,
    });
    return { postid };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error unliking post"
    );
  }
});

export const checkUserLike = createAsyncThunk<
  { postId: number; liked: boolean },
  number,
  { rejectValue: string }
>("posts/checkUserLike", async (postId, thunkAPI) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/api/post-likes/${postId}/user-like`,
      {
        withCredentials: true,
      }
    );
    return { postId, liked: response.data.liked };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error checking like"
    );
  }
});

export const createPost = createAsyncThunk<
  Post,
  {
    userid: number | undefined;
    title: string;
    content?: string;
    posttype: "normal" | "question";
  },
  { rejectValue: string }
>("posts/createPost", async (newPost, thunkAPI) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/api/posts`, newPost, {
      withCredentials: true,
    });
    return response.data.post;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to create post"
    );
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPostsByType.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading = false;
          state.posts = action.payload;
        }
      )
      .addCase(fetchPostsByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPost = null;
      })
      .addCase(getPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
      })

      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        if (state.selectedPost && state.selectedPost.id === action.payload) {
          state.selectedPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete post";
      })

      .addCase(createPost.pending, (state) => {
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload || "Failed to update post";
      })
      .addCase(
        likePost.fulfilled,
        (state, action: PayloadAction<{ postid: number }>) => {
          const post = state.posts.find((p) => p.id === action.payload.postid);
          if (post) {
            post.likecount = (post.likecount || 0) + 1;
            post.islikedbyuser = true;
          }
          if (
            state.selectedPost &&
            state.selectedPost.id === action.payload.postid
          ) {
            state.selectedPost.likecount =
              (state.selectedPost.likecount || 0) + 1;
            state.selectedPost.islikedbyuser = true;
          }
        }
      )
      .addCase(
        unlikePost.fulfilled,
        (state, action: PayloadAction<{ postid: number }>) => {
          const post = state.posts.find((p) => p.id === action.payload.postid);
          if (post && post.likecount && post.likecount > 0) {
            post.likecount -= 1;
            post.islikedbyuser = false;
          }
          if (
            state.selectedPost &&
            state.selectedPost.id === action.payload.postid
          ) {
            state.selectedPost.likecount =
              (state.selectedPost.likecount || 0) - 1;
            state.selectedPost.islikedbyuser = false;
          }
        }
      )
      .addCase(checkUserLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        checkUserLike.fulfilled,
        (state, action: PayloadAction<{ postId: number; liked: boolean }>) => {
          state.loading = false;
          const post = state.posts.find((p) => p.id === action.payload.postId);
          if (post) {
            post.islikedbyuser = action.payload.liked;
          }
        }
      )
      .addCase(checkUserLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to check like";
      });
  },
});

export const { clearPosts, clearSelectedPost } = postsSlice.actions;
export default postsSlice.reducer;
