import { createSlice } from '@reduxjs/toolkit';

const initialLoggedInState = localStorage.getItem('userData')
  ? JSON.parse(localStorage.getItem('userData'))
  : {};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialLoggedInState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;

      const tokenExpirationDate =
        action.payload.tokenExpiration ||
        new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
      state.tokenExpiration = tokenExpirationDate;

      localStorage.setItem(
        'userData',
        JSON.stringify({
          token: state.token,
          userId: state.userId,
          expiration: tokenExpirationDate,
        })
      );
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.tokenExpiration = null;
      localStorage.removeItem('userData');
      localStorage.removeItem('userShippingAddress');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
