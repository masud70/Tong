import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TViewProps = ViewProps & {
	style?: ViewStyle | ViewStyle[];
};

const ThemedView: React.FC<TViewProps> = ({ style, ...props }) => {
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();

	return (
		<View
			style={[
				{
					backgroundColor: theme.color.background,
					flex: 1,
					paddingTop: insets.top,
					paddingBottom: insets.bottom,
					// paddingLeft: 6,
					// paddingRight: 6,
				},
				style,
			]}
			{...props}
		/>
	);
};

export default ThemedView;
