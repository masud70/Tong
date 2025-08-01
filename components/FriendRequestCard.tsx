import { styles } from "@/constants/Constants";
import { useFriend } from "@/hooks/useFriend";
import { useMessage } from "@/hooks/useMessage";
import { useTheme } from "@/hooks/useTheme";
import { Friend } from "@/types/friends";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Loading from "./LoadingIndicator";
import ProfileImage from "./ProfileImage";

const FriendRequestCard = ({ request }: { request: Friend }) => {
	const { isLoading, acceptFriendRequest } = useFriend();
	const { openNewChat } = useMessage();
	const { theme } = useTheme();

	return (
		<View className="border border-gray-300 rounded-md p-2 bg-gray-100 flex flex-row items-center justify-between">
			<View className="flex flex-row items-center space-x-2">
				<ProfileImage size={45} showBorder className="mr-2" />
				<View>
					<Text style={[styles.smallTextBold]}>
						{request.displayName.substring(0, 30)}
					</Text>
					<Text style={[styles.xsText, styles.subText]}>
						{request.email.substring(0, 30)}
					</Text>
				</View>
			</View>

			<TouchableOpacity
				onPress={
					request.isFriend
						? async () => await openNewChat([request.id])
						: () => acceptFriendRequest(request.id)
				}
				disabled={isLoading}
				className="rounded-full px-3 py-2 items-center"
				style={[
					{
						backgroundColor: isLoading
							? theme.color.primaryOpacity
							: request.isFriend
							? theme.color.primary
							: theme.color.tertiary,
						minWidth: 85,
					},
				]}
			>
				{isLoading ? (
					<Loading size={20} color={theme.color.simple} />
				) : (
					<Text
						style={[
							styles.smallTextBold,
							{ color: theme.color.simple },
						]}
					>
						{request.isFriend ? "Chat Now" : "Accept"}
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default FriendRequestCard;
