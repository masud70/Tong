import TView from "@/components/TView";
import { useChat } from "@/hooks/useChat";
import { useCommon } from "@/hooks/useCommon";
import { ChatType } from "@/types/chats";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
	FlatList,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const Chats = () => {
	const router = useRouter();
	const { searchTerm, setSearchTerm, chats } = useChat();
	const { formatDT } = useCommon();

	// Filter chats based on search term
	const filteredChats = useMemo(() => {
		if (!searchTerm.trim()) return chats;

		return chats.filter((chat) =>
			chat.chat_title.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [chats, searchTerm]);

	// Handle chat item press
	const handleChatPress = (chat: ChatType) => {
		try {
			console.log(`Navigating to chat with ${chat.chat_title}`);
			router.push(`./message/${chat.id}`);
		} catch (error) {
			console.error("Error navigating to chat:", error);
			return;
		}
	};

	// Render individual chat item
	const renderChatItem = ({ item }: { item: ChatType }) => (
		<TouchableOpacity
			className="flex-row items-center p-4 border-b border-gray-100 bg-white active:bg-gray-50"
			onPress={() => handleChatPress(item)}
			activeOpacity={0.7}
		>
			{/* Avatar */}
			<View className="relative mr-3">
				<Image
					source={
						item.avatar
							? { uri: item.avatar }
							: require("@/assets/images/tong.png")
					}
					className="w-12 h-12 rounded-full"
				/>

				{/* Online indicator */}
				{item.isOnline && (
					<View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
				)}
			</View>

			{/* Chat content */}
			<View className="flex-1 mr-3">
				<View className="flex-row items-center justify-between mb-1">
					<Text
						className="text-gray-900 font-semibold text-base"
						numberOfLines={1}
					>
						{item.chat_title ? item.chat_title : "Personal Chatbox"}
					</Text>
					<Text className="text-gray-500 text-xs">
						{formatDT(new Date(item.created_at))}
					</Text>
				</View>

				<View className="flex-row items-center">
					<Text
						className={`flex-1 text-sm ${"text-gray-600"}`}
						numberOfLines={1}
					>
						{item.lastMessage
							? item.lastMessage
							: String(item.chat_members.length) + " People"}
					</Text>

					{/* Unread count badge */}
					{item.unreadCount! > 0 && (
						<View className="ml-2 bg-blue-600 rounded-full min-w-5 h-5 items-center justify-center px-1">
							<Text className="text-white text-xs font-bold">
								{item.unreadCount! > 99
									? "99+"
									: item.unreadCount}
							</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);

	// Empty state
	const renderEmptyState = () => (
		<View className="flex-1 items-center justify-center py-20">
			<Text className="text-6xl mb-4">💬</Text>
			<Text className="text-gray-500 text-lg font-medium mb-2">
				{searchTerm ? "No chats found" : "No conversations yet"}
			</Text>
			<Text className="text-gray-400 text-center px-8">
				{searchTerm
					? `No results for "${searchTerm}"`
					: "Start a conversation with someone!"}
			</Text>
		</View>
	);

	return (
		<TView className="flex-1">
			{/* Header */}
			<View className="px-2 py-2 border-b border-gray-100">
				{/* Search Input */}
				<View className="relative">
					<TextInput
						className="bg-gray-100 rounded-full px-4 py-3 pr-10 text-gray-900 text-base"
						placeholder="Search conversations..."
						placeholderTextColor="#9CA3AF"
						value={searchTerm}
						onChangeText={setSearchTerm}
						autoCapitalize="none"
						autoCorrect={false}
					/>

					{/* Search Icon */}
					<View className="absolute right-3 top-3">
						<Text className="text-gray-400 text-lg">🔍</Text>
					</View>

					{/* Clear Search */}
					{searchTerm.length > 0 && (
						<TouchableOpacity
							className="absolute right-8 top-3"
							onPress={() => setSearchTerm("")}
							hitSlop={{
								top: 10,
								bottom: 10,
								left: 10,
								right: 10,
							}}
						>
							<View className="w-5 h-5 bg-gray-400 rounded-full items-center justify-center">
								<Text className="text-white text-xs font-bold">
									✕
								</Text>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Chat List */}
			<FlatList
				data={filteredChats}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderChatItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={
					filteredChats.length === 0 ? { flex: 1 } : undefined
				}
				ListEmptyComponent={renderEmptyState}
				// refreshControl={
				// 	<RefreshControl
				// 		refreshing={isRefreshing}
				// 		onRefresh={onRefresh}
				// 	/>
				// }
			/>

			{/* Floating Action Button (Optional) */}
			<TouchableOpacity
				className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
				onPress={() => {
					console.log("Create new chat");
				}}
				activeOpacity={0.8}
			>
				<Text className="text-white text-2xl font-bold">+</Text>
			</TouchableOpacity>
		</TView>
	);
};

export default Chats;
