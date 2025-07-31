import { styles } from "@/constants/Constants";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from "react-native";
import Loading from "./LoadingIndicator";

interface CustomSearchInputProps extends TextInputProps {
	onPress: () => void;
	searching?: boolean;
}

const CustomSearchInput = ({
	onPress,
	searching = false,
	...props
}: CustomSearchInputProps) => {
	const { theme } = useTheme();
	return (
		<View
			style={{ backgroundColor: theme.color.simple }}
			className="flex flex-row items-center justify-between border border-gray-300 rounded-full overflow-hidden"
		>
			<TextInput
				{...props}
				style={styles.smallText}
				className="flex-1 pl-4"
			/>
			<TouchableOpacity
				onPress={onPress}
				disabled={searching}
				className="h-full w-10 justify-center flex-row flex items-center"
			>
				{searching ? (
					<Loading size={25} color={theme.color.foreground} />
				) : (
					<Ionicons
						name="search"
						size={22}
						color={theme.color.foreground}
						className=" text-center"
					/>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default CustomSearchInput;
