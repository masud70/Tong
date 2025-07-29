import FriendListCard from "@/components/FriendListCard";
import FriendRequestCard from "@/components/FriendRequestCard";
import TView from "@/components/TView";
import { useFriend } from "@/hooks/useFriend";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const Friends = () => {
	const {
		searchTerm,
		setSearchTerm,
		handleSearch,
		isLoading,
		friends,
		friendRequests,
		myFriends,
	} = useFriend();
	return (
		<TView className="px-4 pt-2 pb-1">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<View className="mb-2 justify-center">
					<TextInput
						editable
						placeholderTextColor="#999"
						placeholder="Search friends here..."
						value={searchTerm}
						onChangeText={setSearchTerm}
						className="rounded-full bg-gray-200 px-3 py-3 text-lg w-full absolute"
					/>
					{isLoading ? (
						<ActivityIndicator
							size={28}
							color={"#344D67"}
							className="bg-[#344D67]/20 hover:bg-[#344D67] p-2 w-12 left-[88%] h-12 rounded-full items-center justify-center relative"
						/>
					) : (
						<TouchableOpacity
							onPress={handleSearch}
							className="bg-[#344D67]/20 hover:bg-[#344D67] p-2 w-12 left-[88%] h-12 rounded-full items-center justify-center relative"
						>
							<Ionicons
								name="search"
								size={24}
								color={"#344D67"}
								className="text-white"
							/>
						</TouchableOpacity>
					)}
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					className="flex-1"
				>
					<View className="gap-1">
						{searchTerm ? (
							friends.map((friend) => (
								<FriendListCard key={friend.id} user={friend} />
							))
						) : friendRequests.length ? (
							<View className="w-full gap-1">
								<Text className="w-full text-center text-white border-b border-white mb-1 text-lg">
									Friend requests
								</Text>
								{friendRequests.map((request) => (
									<FriendRequestCard
										key={request.id}
										request={request}
									/>
								))}
							</View>
						) : null}
						{myFriends.map((f, idx) => (
							<FriendListCard key={idx} user={f} />
						))}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TView>
	);
};

export default Friends;
