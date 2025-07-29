import TView from "@/components/TView";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

const Profile = () => {
	const { handleSignOut } = useAuth();
	return (
		<TView className="items-center gap-2 p-2">
			<Image
				source={require("@/assets/images/tong.png")}
				className="w-36 h-36 rounded-full"
			/>
			<Text className="font-bold text-4xl text-white">Jhon Doe</Text>
			<TouchableOpacity
				onPress={handleSignOut}
				className="bg-red-500 px-4 py-2 rounded-lg items-center justify-center"
			>
				<Text className="text-white font-bold text-lg">Sign Out</Text>
			</TouchableOpacity>
		</TView>
	);
};

export default Profile;
