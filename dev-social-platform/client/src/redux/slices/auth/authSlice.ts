import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../../../../backend/src/types/User";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/users/me`, {
      withCredentials: true,
    });

    return response.data.user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Unauthorized"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axios.post(
        `${apiBaseUrl}/api/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk<
  User,
  {
    username?: string;
    email?: string;
    profilePicture?: string;
    currentPassword: string;
    newPassword?: string;
  },
  { rejectValue: string }
>(
  "auth/updateProfile",
  async (
    { username, email, profilePicture, currentPassword, newPassword },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/users/update-profile`,
        { username, email, profilePicture, currentPassword, newPassword },
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Unknown error";
        }
      )
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(
        fetchCurrentUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Unauthorized";
        }
      )
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          if (state.user) {
            state.user = {
              ...state.user,
              ...action.payload,
            };
          } else {
            state.user = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export default authSlice.reducer;
