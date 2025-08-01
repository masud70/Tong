export const useProfile = () => {
	const handleEditProfile = () => {
		console.log("Edit profile...");
	};

	const handleSettings = () => {
		console.log("Settings...");
	};

	return { handleEditProfile, handleSettings };
};
