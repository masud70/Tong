import ThemedView from "@/components/ThemedView";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, StatusBar } from "react-native";
import "react-native-reanimated";
import "./global.css";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
		Roboto: require("@/assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
		RobotoBold: require("@/assets/fonts/Roboto-Bold.ttf"),
		RobotoExtraBold: require("@/assets/fonts/Roboto-ExtraBold.ttf"),
		RobotoSemiBold: require("@/assets/fonts/Roboto-SemiBold.ttf"),
		RobotoItalic: require("@/assets/fonts/Roboto-Italic-VariableFont_wdth,wght.ttf"),
	});

	if (!fontsLoaded) {
		return (
			<ThemedView className="w-full flex items-center justify-center">
				<ActivityIndicator size="large" color="#4fd1c7" />
			</ThemedView>
		);
	}

	return (
		<ThemedView>
			<StatusBar />
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen
					name="splash/index"
					options={{ title: "Initial Splash Screen" }}
				/>
			</Stack>
		</ThemedView>
	);
}
