import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";
import { StatusBar, View } from "react-native";

const GradientBackground: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<View className="flex-1">
			<StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
			<LinearGradient
				colors={["#1a1a2e", "#16213e", "#0f3460"]}
				className="absolute inset-0"
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			/>
			{children}
		</View>
	);
};

export default GradientBackground;
