// src/features/users/usersSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../api/user.api"; 
import type { UsersState } from "../../types/user";      



const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const users = await getUsers();
  return users;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      });
  },
});

export default usersSlice.reducer;
