import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Post } from "../../../../backend/src/types/Post";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
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
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.reponse?.data?.message || "Failed to fetch posts"
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
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to create post"
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
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
