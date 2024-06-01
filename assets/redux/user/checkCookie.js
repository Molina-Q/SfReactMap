import { clearUser } from "./userSlice";
import Cookies from "js-cookie";

const checkCookieExpirationMiddleware = (store) => (next) => (action) => {

  // fix recursion error
	if (action.type === clearUser.type) {
		return next(action);
	}

	// Check if the cookie is expired
	const cookie = Cookies.get("BEARER");

	// if cookie is null or undefined it means it has expired
	if (!cookie) {
		// If the cookie is expired, dispatch the clearUser action
		store.dispatch(clearUser());
	}

	// Continue processing this action
	return next(action);
};

export default checkCookieExpirationMiddleware;
