import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HTTP_GET, HTTP_POST } from "../../https"; // Use custom HTTP functions

// Async thunk to fetch parties
export const fetchParties = createAsyncThunk(
  "vote/fetchParties",
  async () => {
    const response = await HTTP_GET(`${process.env.REACT_APP_API_BASE_URL}/getParties`);
    return response.data;
  }
);

// Async thunk to submit a vote
export const submitVote = createAsyncThunk(
  "vote/submitVote",
  async ({ userId, partyId }) => {
    const response = await HTTP_POST(`${process.env.REACT_APP_API_BASE_URL}/vote`, { userId, partyId });
    return response.data;
  }
);

const voteSlice = createSlice({
  name: "vote",
  initialState: {
    parties: [],
    loading: false,
    error: "",
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchParties.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchParties.fulfilled, (state, action) => {
      state.loading = false;
      state.parties = action.payload;
    });
    builder.addCase(fetchParties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(submitVote.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(submitVote.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(submitVote.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default voteSlice.reducer;
