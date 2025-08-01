import { styles } from "@/constants/Constants";
import { useFriend } from "@/hooks/useFriend";
import { useMessage } from "@/hooks/useMessage";
import { useTheme } from "@/hooks/useTheme";
import { Friend } from "@/types/friends";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Loading from "./LoadingIndicator";
import ProfileImage from "./ProfileImage";

const FriendListCard = ({ user }: { user: Friend }) => {
	const {
		isLoading,
		sendFriendRequest,
		acceptFriendRequest,
		cancelFriendRequest,
	} = useFriend();
	const { openNewChat } = useMessage({ chatId: 0 });
	const { theme } = useTheme();

	return (
		<View className="border border-gray-300 rounded-md p-2 flex flex-row items-center justify-between">
			<View className="flex flex-row items-center gap-2">
				<ProfileImage />
				<View>
					<Text style={[styles.smallTextBold]}>
						{user.displayName}
					</Text>
					<Text style={[styles.xsText, styles.subText]}>
						{user.email}
					</Text>
				</View>
			</View>

			<TouchableOpacity
				onPress={
					user.isFriend
						? async () => await openNewChat([user.id])
						: user.requested
						? user.requestedBy === user.id
							? () => acceptFriendRequest(user.id)
							: () => cancelFriendRequest(user.id)
						: () => sendFriendRequest(user.id)
				}
				disabled={isLoading}
				className="rounded-full px-3 py-2 items-center"
				style={[
					{
						backgroundColor: isLoading
							? theme.color.primaryOpacity
							: user.isFriend
							? theme.color.primary
							: user.requested
							? user.requestedBy === user.id
								? theme.color.tertiary
								: theme.color.danger
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
						{user.isFriend
							? "Chat Now"
							: user.requested
							? user.requestedBy === user.id
								? "Accept"
								: "Cancel"
							: "Add Friend"}
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default FriendListCard;
