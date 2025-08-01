import CustomSearchInput from "@/components/CustomSearchInput";
import FriendListCard from "@/components/FriendListCard";
import FriendRequestCard from "@/components/FriendRequestCard";
import Loading from "@/components/LoadingIndicator";
import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import { useFriend } from "@/hooks/useFriend";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	ScrollView,
	Text,
	View,
} from "react-native";

const Friends = () => {
	const {
		searchTerm,
		setSearchTerm,
		isLoading,
		isSearching,
		friends,
		friendRequests,
		myFriends,
		searchFriends,
		fetchMyFriends,
	} = useFriend();
	return (
		<ThemedView className="flex-1">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="flex-1"
			>
				<View className="px-2 py-2 border-b border-gray-300">
					<CustomSearchInput
						onPress={searchFriends}
						searching={isSearching}
						value={searchTerm}
						needCancel={friends.length !== 0}
						onChangeText={setSearchTerm}
						placeholder="Search friends here..."
						keyboardType="email-address"
						onPressCancel={() => setSearchTerm("")}
					/>
				</View>

				{isLoading ? (
					<Loading style={{ marginTop: 20 }} />
				) : (
					<ScrollView
						showsVerticalScrollIndicator={false}
						className="flex-1 px-1 mt-1"
						refreshControl={
							<RefreshControl
								refreshing={isLoading}
								onRefresh={
									searchTerm ? searchFriends : fetchMyFriends
								}
							/>
						}
					>
						<View className="gap-1">
							{searchTerm ? (
								friends.map((friend) => (
									<FriendListCard
										key={friend.id}
										user={friend}
									/>
								))
							) : (
								<>
									{friendRequests.length ? (
										<View className="w-full gap-1">
											<Text
												style={[styles.regularTextBold]}
												className="w-full text-center border-b pb-1 border-gray-200"
											>
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

									{myFriends.length ? (
										<View className="w-full gap-1">
											<Text
												style={[styles.regularTextBold]}
												className="w-full text-center border-b pb-1 border-gray-200"
											>
												My friends
											</Text>
											{myFriends.map((f, idx) => (
												<FriendListCard
													key={idx}
													user={f}
												/>
											))}
										</View>
									) : null}
								</>
							)}
						</View>
					</ScrollView>
				)}
			</KeyboardAvoidingView>
		</ThemedView>
	);
};

export default Friends;
