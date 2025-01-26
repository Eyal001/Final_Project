import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Comment } from "../../../../backend/src/types/Comment";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const likeComment = createAsyncThunk<
  { commentId: number },
  number,
  { rejectValue: string }
>("comments/likeComment", async (commentId, thunkAPI) => {
  try {
    await axios.post(
      `${apiBaseUrl}/api/comment-likes/${commentId}/like`,
      {},
      { withCredentials: true }
    );
    return { commentId };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error liking comment"
    );
  }
});

export const unlikeComment = createAsyncThunk<
  { commentId: number },
  number,
  { rejectValue: string }
>("comments/unlikeComment", async (commentId, thunkAPI) => {
  try {
    await axios.delete(`${apiBaseUrl}/api/comment-likes/${commentId}/unlike`, {
      withCredentials: true,
    });
    return { commentId };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Error unliking comment"
    );
  }
});

export const getCommentsByPostId = createAsyncThunk<
  Comment[],
  number,
  { rejectValue: string }
>("comments/getCommentsByPostId", async (postId, thunkAPI) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/comments/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to fetch comments"
    );
  }
});

export const addComment = createAsyncThunk<
  Comment,
  { postid: number; content: string },
  { rejectValue: string }
>("comments/addComment", async ({ postid, content }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/comments/${postid}`,
      { content },
      { withCredentials: true }
    );
    return response.data.comment;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to add comment"
    );
  }
});

export const updateComment = createAsyncThunk<
  Comment,
  { commentId: number; content: string },
  { rejectValue: string }
>("comments/updateComment", async ({ commentId, content }, thunkAPI) => {
  try {
    const response = await axios.put(
      `${apiBaseUrl}/api/comments/${commentId}`,
      { content },
      { withCredentials: true }
    );
    return response.data.comment;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to update comment"
    );
  }
});

export const deleteComment = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("comments/deleteComment", async (commentId, thunkAPI) => {
  try {
    await axios.delete(`${apiBaseUrl}/api/comments/${commentId}`, {
      withCredentials: true,
    });
    return commentId;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to delete comment"
    );
  }
});

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        likeComment.fulfilled,
        (state, action: PayloadAction<{ commentId: number }>) => {
          const comment = state.comments.find(
            (c) => c.id === action.payload.commentId
          );
          if (comment) {
            comment.likecount = (comment.likecount || 0) + 1;
            comment.islikedbyuser = true;
            state.loading = false;
          }
        }
      )
      .addCase(
        unlikeComment.fulfilled,
        (state, action: PayloadAction<{ commentId: number }>) => {
          const comment = state.comments.find(
            (c) => c.id === action.payload.commentId
          );
          if (comment && comment.likecount && comment.likecount > 0) {
            comment.likecount -= 1;
            comment.islikedbyuser = false;
            state.loading = false;
          }
        }
      )
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.comments.unshift(action.payload);
          state.loading = false;
        }
      )
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add comment";
      })

      .addCase(
        updateComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          const index = state.comments.findIndex(
            (c) => c.id === action.payload.id
          );
          if (index !== -1) {
            state.comments[index].content = action.payload.content;
          }
        }
      )
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload || "Failed to update comment";
      })
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.comments = state.comments.filter(
            (c) => c.id !== action.payload
          );
          state.loading = false;
        }
      )
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete comment";
      })

      .addCase(
        getCommentsByPostId.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.loading = false;
          state.comments = action.payload;
        }
      )
      .addCase(getCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch comments";
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
