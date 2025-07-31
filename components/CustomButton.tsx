import { Const, styles } from "@/constants/Constants";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Loading from "./LoadingIndicator";

interface CustomButtonProps extends TouchableOpacityProps {
	text: string;
	backgroundColor?: "primary" | "secondary" | "danger" | "transparent";
	size?: "small" | "medium" | "large" | number;
	textColor?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	isLoading?: boolean;
}

const CustomButton = ({
	text,
	backgroundColor = "primary",
	size = "large",
	textColor = "text-white",
	disabled = false,
	isLoading = false,
	leftIcon,
	rightIcon,
	...props
}: CustomButtonProps) => {
	const buttonClasses = `
		${
			backgroundColor === "transparent" && "border-2 border-gray-100"
		}px-3 py-3 rounded-full flex-row items-center justify-center ${
		disabled ? "opacity-80" : "active:opacity-80"
	}
	`
		.replace(/\s+/g, " ")
		.trim();

	// Text classes
	const textClasses = `${
		backgroundColor !== "transparent" ? textColor : Const.color.background
	} text-xl font-semibold ${leftIcon ? "ml-1" : ""} ${
		rightIcon ? "mr-1" : ""
	}`
		.replace(/\s+/g, " ")
		.trim();

	return (
		<TouchableOpacity
			{...props}
			className={buttonClasses}
			disabled={disabled}
			style={[
				{
					minWidth:
						size === "small"
							? "20%"
							: size === "medium"
							? "50%"
							: size === "large"
							? "85%"
							: size,
					backgroundColor: Const.buttonColor[backgroundColor],
				},
			]}
		>
			{isLoading ? (
				<Loading animating={!isLoading} size={22} color={"white"} />
			) : (
				<>
					{leftIcon && leftIcon}
					<Text
						style={[styles.regularTextBold]}
						className={textClasses}
					>
						{text}
					</Text>
					{rightIcon && rightIcon}
				</>
			)}
		</TouchableOpacity>
	);
};

export default CustomButton;
