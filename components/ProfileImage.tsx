import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, ImageProps, TouchableOpacity, View } from "react-native";

interface ProfileImageProps extends Omit<ImageProps, "source"> {
	path?: string;
	uri?: string;
	size?: number;
	showBorder?: boolean;
	borderColor?: string;
	borderWidth?: number;
	fallbackIcon?: keyof typeof Ionicons.glyphMap;
	onPress?: () => void;
	showOnlineStatus?: boolean;
	isOnline?: boolean;
	rounded?: boolean;
	isGroup?: boolean;
	className?: string;
}

const ProfileImage = ({
	path,
	uri,
	size = 40,
	showBorder = false,
	borderColor = "#D5D7DB",
	borderWidth = 2,
	fallbackIcon = "person",
	isGroup = false,
	onPress,
	showOnlineStatus = false,
	isOnline = false,
	rounded = true,
	className,
	style,
	...props
}: ProfileImageProps) => {
	// Determine image source
	const getImageSource = () => {
		if (uri) {
			return { uri };
		}
		if (path) {
			// For local images, you'll need to import them or use a different approach
			// Since require() needs a literal string, we'll handle URIs primarily
			try {
				return { uri: path };
			} catch (error) {
				console.warn("Invalid image path:", path, error);
				return null;
			}
		}
		return null;
	};

	const imageSource = getImageSource();
	showOnlineStatus = showOnlineStatus || isOnline;
	fallbackIcon =
		fallbackIcon === "person" && isGroup ? "people" : fallbackIcon;

	// Container styles
	const containerStyle = {
		width: size,
		height: size,
		position: "relative" as const,
	};

	// Image styles
	const imageStyle = {
		width: size,
		height: size,
		borderRadius: rounded ? size / 2 : 8,
		...(showBorder && {
			borderWidth,
			borderColor,
		}),
	};

	// Online status dot styles
	const onlineStatusStyle = {
		position: "absolute" as const,
		bottom: 0,
		right: 0,
		width: size * 0.3,
		height: size * 0.3,
		borderRadius: (size * 0.3) / 2,
		backgroundColor: isOnline ? "#10B981" : "#6B7280",
		borderWidth: 2,
		borderColor: "#FFFFFF",
	};

	const renderImage = () => {
		if (imageSource) {
			return (
				<Image
					{...props}
					source={imageSource}
					style={[imageStyle, style]}
					defaultSource={require("@/assets/images/tong.png")}
					onError={() =>
						console.warn("Failed to load image:", imageSource)
					}
				/>
			);
		}

		// Fallback to icon
		return (
			<View
				style={[
					imageStyle,
					{
						backgroundColor: "#F3F4F6",
						justifyContent: "center",
						alignItems: "center",
					},
					style,
				]}
			>
				<Ionicons
					name={fallbackIcon}
					size={size * 0.6}
					color="#6B7280"
				/>
			</View>
		);
	};

	const content = (
		<View
			style={containerStyle}
			className={!onPress ? className : undefined}
		>
			{renderImage()}
			{showOnlineStatus && <View style={onlineStatusStyle} />}
		</View>
	);

	// If onPress is provided, wrap in TouchableOpacity
	if (onPress) {
		return (
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.8}
				className={!onPress ? undefined : className}
			>
				{content}
			</TouchableOpacity>
		);
	}

	return content;
};

export default ProfileImage;
