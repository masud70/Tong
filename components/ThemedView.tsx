// import { useTheme } from "@/hooks/useTheme";
// import React, { useRef, useState } from "react";
// import {
// 	AppState,
// 	SafeAreaView,
// 	View,
// 	ViewProps,
// 	ViewStyle,
// } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// type TViewProps = ViewProps & {
// 	style?: ViewStyle | ViewStyle[];
// 	children: React.ReactNode;
// };

// const ThemedView: React.FC<TViewProps> = ({ style, children, ...props }) => {
// 	const insets = useSafeAreaInsets();
// 	const { theme } = useTheme();
// 	const [isReady, setIsReady] = useState(true);
// 	const appState = useRef(AppState.currentState);
// 	const [forceUpdateKey, setForceUpdateKey] = useState(0);

// 	// Fix for incorrect insets or layout when returning from background
// 	// useEffect(() => {
// 	// 	const handleAppStateChange = (nextAppState: AppStateStatus) => {
// 	// 		if (
// 	// 			appState.current.match(/inactive|background/) &&
// 	// 			nextAppState === "active"
// 	// 		) {
// 	// 			setIsReady(false);
// 	// 			// Delay re-render to allow insets to re-calculate
// 	// 			setTimeout(() => setIsReady(true), 50);
// 	// 			setForceUpdateKey((prev) => prev + 1);
// 	// 		}
// 	// 		appState.current = nextAppState;
// 	// 	};

// 	// 	const subscription = AppState.addEventListener(
// 	// 		"change",
// 	// 		handleAppStateChange
// 	// 	);
// 	// 	return () => subscription.remove();
// 	// }, []);

// 	// if (!isReady) return null;

// 	return (
// 		<SafeAreaView style={{ flex: 1 }}>
// 			<KeyboardAwareScrollView
// 				style={{
// 					// flex: 1,
// 					backgroundColor: theme.color.background,
// 					maxHeight: "100%",
// 				}}
// 				contentContainerStyle={{ flexGrow: 1 }}
// 				keyboardShouldPersistTaps="handled"
// 			>
// 				{/* <KeyboardAvoidingView
// 				style={[{ flex: 1 }, style]}
// 				key={forceUpdateKey}
// 				behavior={Platform.OS === "ios" ? "padding" : undefined}
// 				keyboardVerticalOffset={insets.top + 12} // tune if header present
// 				{...props}
// 			> */}
// 				<View style={{ flex: 1 }} {...props}>
// 					{children}
// 				</View>
// 				{/* </KeyboardAvoidingView> */}
// 			</KeyboardAwareScrollView>
// 		</SafeAreaView>
// 	);
// };

// export default ThemedView;

import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ViewProps,
	ViewStyle,
} from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TViewProps = ViewProps & {
	style?: ViewStyle | ViewStyle[];
	children: React.ReactNode;
};

const ThemedView: React.FC<TViewProps> = ({ style, children, ...props }) => {
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();

	return (
		<SafeAreaView
			style={[
				{
					flex: 1,
					backgroundColor: theme.color.background,
					// paddingTop: insets.top,
					paddingBottom: insets.bottom,
					paddingLeft: insets.left,
					paddingRight: insets.right,
				},
				style,
			]}
			{...props}
		>
			<KeyboardAvoidingView
				style={[{ flex: 1 }]}
				// key={forceUpdateKey}
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={insets.top} // tune if header present
				{...props}
			>
				{children}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default ThemedView;
