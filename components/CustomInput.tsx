import { styles } from "@/constants/Constants";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from "react-native";

interface CustomInputProps extends TextInputProps {
	rightIcon?: React.ReactNode;
	onClickIcon?: () => void;
}

const CustomInput = ({
	rightIcon,
	onClickIcon,
	style,
	...props
}: CustomInputProps) => {
	const { theme } = useTheme();
	return (
		<View
			style={[
				{
					backgroundColor: theme.color.inputBackground,
				},
			]}
			className="w-full flex flex-row justify-between items-center rounded-full"
		>
			<TextInput
				style={[style, styles.smallText]}
				{...props}
				className="px-4 py-3 flex-1"
				placeholderTextColor={theme.color.subText}
			/>
			{rightIcon && (
				<TouchableOpacity
					onPress={onClickIcon}
					style={{ opacity: 0.55 }}
					className="w-10"
				>
					{rightIcon}
				</TouchableOpacity>
			)}
		</View>
	);
};

export default CustomInput;
