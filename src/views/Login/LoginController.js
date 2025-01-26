import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HTTP_POST } from "../../https";

// Initial state of the user login
const initialState = {
  loading: false,
  isUserValid: false,
  error: "",
  token: "",
};

// Async thunk to fetch user authentication from an API
export const getUserAuthentication = createAsyncThunk(
  "userAuthentication",
  async (loginDetails = {}) => {
    console.log(loginDetails); // Contains login ID or password entered by user, send this to API as payload
    try {
      const response = await HTTP_POST(
        `${process.env.REACT_APP_API_BASE_URL}/login`, // Use environment variable for API base URL
        {
          email: loginDetails.email,
          password: loginDetails.password,
        }
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

// Slice for user authentication reducer
const userAuthenticationReducer = createSlice({
  name: "userAuthentication",
  initialState,
  reducers: {
    resetState: (state) => {
      localStorage.clear();
      sessionStorage.clear();
      state.loading = false;
      state.isUserValid = false;
      state.error = "";
      state.token = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserAuthentication.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.isUserValid = false;
    });
    builder.addCase(getUserAuthentication.fulfilled, (state, action) => {
      if (action.payload.message === "Login successful!") {
        state.loading = false;
        state.isUserValid = true;
        state.error = "";
        state.token = action.payload.token;
        sessionStorage.setItem("userId", action.payload.userId); // Store user ID in session storage
      } else {
        state.loading = false;
        state.isUserValid = false;
        state.error = "Invalid credentials or email not verified";
        state.token = "";
      }
    });
    builder.addCase(getUserAuthentication.rejected, (state, action) => {
      state.loading = false;
      state.isUserValid = false;
      state.error = action.error.message;
      state.token = "";
    });
  },
});

export default userAuthenticationReducer.reducer;

export const { resetState } = userAuthenticationReducer.actions;
