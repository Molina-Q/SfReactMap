import { jwtDecode } from "jwt-decode";
import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
	const {currentUser} = useSelector(state => state.user);

	console.log("current user : ", currentUser.username);

	// const token = currentUser.token;
	// const decodedToken = jwtDecode(token);

	// console.log(decodedToken);

	return <div>
        <h2>Welcome, {`${currentUser.username}`}</h2>
    </div>;
}
