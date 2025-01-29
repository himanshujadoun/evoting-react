import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HTTP_POST } from "../../https"; // Adjust the path

const initialState = {
  loading: false,
  isUserValid: false,
  error: "",
  token: "",
};

export const getUserAuthentication = createAsyncThunk(
  "userAuthentication",
  async (loginDetails = {}) => {
    try {
      const response = await HTTP_POST(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
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
        localStorage.setItem("userId", action.payload.userId);
        sessionStorage.setItem("FullToken", action.payload.token);
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
