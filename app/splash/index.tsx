import Loading from "@/components/LoadingIndicator";
import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import { useRoot } from "@/hooks/useRoot";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { Image, Text, View } from "react-native";

const InitialSplashScreen = () => {
	const { theme } = useTheme();
	const { isLoading } = useRoot();
	return (
		<ThemedView>
			<View className="flex flex-col h-full items-center justify-center gap-2">
				<Image
					source={require("@/assets/images/tong.png")}
					className="w-36 h-36 rounded-full mb-2"
				/>
				<Text style={[styles.logoText, { color: theme.color.primary }]}>
					Tong
				</Text>
				<Loading animating={isLoading} />
			</View>
		</ThemedView>
	);
};

export default InitialSplashScreen;
