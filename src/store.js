import { configureStore } from '@reduxjs/toolkit';
import userAuthenticationReducer from './views/Login/LoginController'; // Adjust the path as needed
import userSignUpReducer from './views/SignUp/signupController'; // Adjust the path as needed
import voteReducer from './views/Vote/voteController'; // Import the vote reducer
const store = configureStore({
  reducer: {
    userAuthentication: userAuthenticationReducer,
    userSignUp: userSignUpReducer,
    vote: voteReducer, // Add the vote reducer
  },
});

export default store;
