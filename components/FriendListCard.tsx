import { useFriend } from "@/hooks/useFriend";
import { useMessage } from "@/hooks/useMessage";
import { Friend } from "@/types/friends";
import React from "react";
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const FriendListCard = ({ user }: { user: Friend }) => {
	const {
		isLoading,
		sendFriendRequest,
		acceptFriendRequest,
		cancelFriendRequest,
	} = useFriend();
	const { openNewChat } = useMessage({ chatId: 0 });

	return (
		<View className="border border-gray-300 rounded-md p-2 bg-gray-100 flex flex-row items-center justify-between">
			<View className="flex flex-row items-center space-x-2">
				<View>
					<Image
						source={require("@/assets/images/tong.png")}
						className="w-14 h-14 rounded-full"
					/>
				</View>
				<View>
					<Text className="font-bold text-lg">
						{user.firstName && user.lastName
							? user.firstName + " " + user.lastName
							: user.email.split("@")[0]}
					</Text>
					<Text className="text-gray-600">{user.email}</Text>
				</View>
			</View>

			<View>
				{!isLoading ? (
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
						className="flex flex-row rounded-lg border px-2 py-1 bg-[#344D67]"
					>
						{user.isFriend ? (
							<Text className="font-bold text-lg text-white">
								Chat Now
							</Text>
						) : user.requested ? (
							user.requestedBy === user.id ? (
								<Text className="font-bold text-lg text-white">
									Accept
								</Text>
							) : (
								<Text className="font-bold text-lg text-white">
									Cancel
								</Text>
							)
						) : (
							<Text className="font-bold text-lg text-white">
								Add Friend
							</Text>
						)}
					</TouchableOpacity>
				) : (
					<ActivityIndicator size={28} color={"#344D67"} />
				)}
			</View>
		</View>
	);
};

export default FriendListCard;
