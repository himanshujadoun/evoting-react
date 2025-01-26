import { configureStore } from '@reduxjs/toolkit';
import userAuthenticationReducer from './views/Login/LoginController'; // Adjust the path as needed
import userSignUpReducer from './views/SignUp/signupController'; // Adjust the path as needed

const store = configureStore({
  reducer: {
    userAuthentication: userAuthenticationReducer,
    userSignUp: userSignUpReducer,
  },
});

export default store;
