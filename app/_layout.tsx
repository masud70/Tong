import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./global.css";

import TView from "@/components/TView";
import { useRoot } from "@/hooks/useRoot";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
	const { isLoading, isLoggedIn } = useRoot();
	const insets = useSafeAreaInsets();
	const [loaded] = useFonts({
		SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
	});

	if (!loaded || isLoading) {
		return (
			<TView
				style={{ paddingTop: insets.top }}
				className="w-full flex items-center justify-center"
			>
				<ActivityIndicator size="large" color="#4fd1c7" />
			</TView>
		);
	}

	return (
		<TView style={{ paddingTop: insets.top }}>
			<StatusBar style="auto" />
			{!isLoggedIn ? (
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name="auth/index"
						options={{ title: "Home" }}
					/>
				</Stack>
			) : (
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="+not-found" />
				</Stack>
			)}
		</TView>
	);
}
