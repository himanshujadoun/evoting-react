import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { HTTP_GET, HTTP_POST } from "../../https";

export const fetchParties = createAsyncThunk("vote/fetchParties", async () => {
  const response = await HTTP_GET(`${process.env.REACT_APP_API_BASE_URL}/party/getParties`);
  return response.data;
});

export const submitVote = createAsyncThunk("vote/submitVote", async ({ userId, partyId }) => {
  if (!userId || !partyId) throw new Error("User ID and Party ID are required");
  const response = await HTTP_POST(`${process.env.REACT_APP_API_BASE_URL}/vote`, { userId, partyId });
  return response.data;
});

const voteSlice = createSlice({
  name: "vote",
  initialState: {
    parties: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;
        state.parties = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(submitVote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetMessage } = voteSlice.actions;
export default voteSlice.reducer;