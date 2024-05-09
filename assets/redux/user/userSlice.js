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
		loginSuccess: (state, action) => {
			state.currentUser = action.payload;
			state.loading = false;
			state.error = null;
		},
		loginError: (state,) => {
			state.loading = false;
			state.error = true;
		},
		clearUser: (state) => {
			state.currentUser = null;
		},
	},
});

export const { loginSuccess, loginError, clearUser } = userSlice.actions;

export default userSlice.reducer;
