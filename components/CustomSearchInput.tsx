import { styles } from "@/constants/Constants";
import { useTheme } from "@/hooks/useTheme";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
	Pressable,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from "react-native";
import Loading from "./LoadingIndicator";

interface CustomSearchInputProps extends TextInputProps {
	onPress?: () => void;
	searching?: boolean;
	needCancel?: boolean;
	onPressCancel?: () => void;
}

const CustomSearchInput = ({
	onPress,
	onPressCancel,
	needCancel = false,
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
			<Pressable disabled={!needCancel} onPress={onPressCancel}>
				{needCancel && (
					<Entypo
						name="circle-with-cross"
						size={22}
						color={theme.color.subText}
					/>
				)}
			</Pressable>
			<TouchableOpacity
				onPress={onPress}
				disabled={searching && !onPress}
				className="h-full w-10 mr-1 justify-center flex-row flex items-center"
			>
				{searching && !!onPress ? (
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
