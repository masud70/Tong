import { useFriend } from "@/hooks/useFriend";
import { Friend } from "@/types/friends";
import React from "react";
import {
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const FriendRequestCard = ({ request }: { request: Friend }) => {
	const { isLoading, acceptFriendRequest } = useFriend();
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
						{request.displayName.substring(0, 30)}
					</Text>
					<Text className="text-gray-600">
						{request.email.substring(0, 30)}
					</Text>
				</View>
			</View>

			<View>
				{!isLoading ? (
					<TouchableOpacity
						onPress={() => acceptFriendRequest(request.id)}
						className="flex flex-row rounded-lg border px-2 py-1 bg-[#344D67]"
					>
						<Text className="font-bold text-lg text-white">
							Accept
						</Text>
					</TouchableOpacity>
				) : (
					<ActivityIndicator size={28} color={"#344D67"} />
				)}
			</View>
		</View>
	);
};

export default FriendRequestCard;
