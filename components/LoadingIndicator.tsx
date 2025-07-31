import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

const Loading = ({
	hidesWhenStopped = true,
	color = "",
	size = 40,
	...props
}: ActivityIndicatorProps) => {
	const { theme } = useTheme();

	return (
		<ActivityIndicator
			{...props}
			hidesWhenStopped={hidesWhenStopped}
			size={size}
			color={color === "" ? theme.color.loading : color}
		/>
	);
};

export default Loading;
