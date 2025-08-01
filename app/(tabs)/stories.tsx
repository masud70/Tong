import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import React from "react";
import { Text } from "react-native";

const stories = () => {
	return (
		<ThemedView className="flex-1 w-full items-center justify-center">
			<Text
				style={[
					styles.largeTextBold,
					{ width: "80%", textAlign: "center" },
				]}
				className="font-bold text-gray-500"
			>
				Interesting STORIES feature is comming soon...
			</Text>
		</ThemedView>
	);
};

export default stories;
