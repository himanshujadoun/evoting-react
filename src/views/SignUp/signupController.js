import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to handle user signup
export const signUpUser = createAsyncThunk(
  
  "user/signup",
  async (userDetails) => {
    let url =  `${process.env.REACT_APP_API_BASE_URL}/signup` 
    try {
      const response = await axios.post(
       url, // Use environment variable for API base URL
        userDetails
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      throw Error(error.response?.data?.error || error.message);
    }
  }
);

// Slice for user signup reducer
const userSignUpReducer = createSlice({
  name: "userSignUp",
  initialState: {
    loading: false,
    error: "",
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(signUpUser.fulfilled, (state) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default userSignUpReducer.reducer;
