import { createSlice } from "@reduxjs/toolkit";

const initialState = { // initial value
  currentUser: null,
  error: null,
  loading: false,
};


const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		loginStart: (state) => {
			state.loading = true;
			state.error = null;
		},
		loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		loginError: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearUser: (state) => {
			state.currentUser = null;
		},
	},
});

export const { loginSuccess, loginError, loginStart, clearUser } = userSlice.actions;

export default userSlice.reducer;
