import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	// initial value
	currentUser: null,
	error: null,
	loading: false,
};

const userSlice = createSlice({
	name: "user", // used this to call the slice in the components
	initialState,
	reducers: {
		signInStart: (state) => {
			state.loading = true;
		},
		signInSuccess: (state, action) => {
			state.currentUser = action.payload; // data of the logged user
			state.loading = false;
			state.error = null;
		},
		signInFailure: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const {
	signInFailure,
	signInStart,
	signInSuccess,
} = userSlice.actions;

export default userSlice.reducer;
