import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

type TViewProps = ViewProps & {
	style?: ViewStyle | ViewStyle[];
};

const TView: React.FC<TViewProps> = ({ style, ...props }) => {
	const theme = useTheme();
	return (
		<View
			style={[{ backgroundColor: theme.background, flex: 1 }, style]}
			{...props}
		/>
	);
};

export default TView;
