// Define selectors to retrieve specific pieces of state
export const selectIsUserValid = (state) => state.userAuthentication.isUserValid;
export const selectUserToken = (state) => state.userAuthentication.token;
export const selectUserLoading = (state) => state.userAuthentication.loading;
export const selectUserError = (state) => state.userAuthentication.error;
