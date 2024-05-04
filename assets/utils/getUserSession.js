export const getUserSession = async () => {
	try {
		const response = await fetch("/api/user/getuser");

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const user = await response.json();
		console.log("User session:", user);
		return user;
	} catch (error) {
		console.error("Failed to get user session");
		return null;
	}
};
