import CustomSearchInput from "@/components/CustomSearchInput";
import Loading from "@/components/LoadingIndicator";
import ProfileImage from "@/components/ProfileImage";
import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import { useChat } from "@/hooks/useChat";
import { useCommon } from "@/hooks/useCommon";
import { useTheme } from "@/hooks/useTheme";
import { ChatType } from "@/types/chats";
import { useAuthStore } from "@/zustand/stores";
import React, { useMemo } from "react";
import {
	Alert,
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const Chats = () => {
	const { theme } = useTheme();
	const { formatDT } = useCommon();
	const authUser = useAuthStore.use.authUser();
	const {
		searchTerm,
		setSearchTerm,
		chats,
		fetchChats,
		handleSearch,
		isSearching,
		isLoading,
		handleChatPress,
	} = useChat();

	// Filter chats based on search term
	const filteredChats = useMemo(() => {
		if (!searchTerm.trim()) return chats;
		return chats.filter((chat) =>
			chat.chat_title?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [chats, searchTerm]);

	const getTitle = (item: ChatType) => {
		return (
			item.chat_title ||
			item.chat_members
				.map((m) =>
					authUser?.id !== m.id
						? m.first_name
							? [m.first_name, m.last_name].join(" ")
							: m.email.split("@")[0]
						: null
				)
				.filter((it) => it)
				.join(", ") ||
			"Personal Chatbox"
		);
	};

	// Render individual chat item
	const renderChatItem = ({ item }: { item: ChatType }) => (
		<TouchableOpacity
			className="flex-row items-center p-2 border-b border-gray-100 bg-white"
			onPress={() => handleChatPress(item.id)}
			activeOpacity={0.7}
		>
			{/* Avatar */}
			<View className="mr-3">
				<ProfileImage size={40} showBorder />
			</View>

			{/* Chat content */}
			<View className="flex-1 mr-3">
				<View className="flex-row items-center justify-between mb-1">
					<Text
						className="flex-1"
						numberOfLines={1}
						style={[
							styles.smallTextBold,
							{ color: theme.color.text },
						]}
					>
						{getTitle(item)}
					</Text>
					<Text style={[styles.xsText, styles.subText]}>
						{formatDT(new Date(item.created_at))}
					</Text>
				</View>

				<View className="flex flex-row items-center justify-between">
					<Text
						numberOfLines={1}
						style={[styles.xsText, styles.subText]}
						className="flex-1"
					>
						{item.lastMessage
							? item.lastMessage
							: String(item.chat_members.length) + " People"}
					</Text>

					{/* Unread count badge */}
					{item.unreadCount! > 0 && (
						<View
							style={{ backgroundColor: theme.color.primary }}
							className="ml-2 bg-blue-600 rounded-full min-w-5 h-5 items-center justify-center px-1"
						>
							<Text
								style={[
									styles.xsText,
									{ color: theme.color.simple },
								]}
							>
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
		<ThemedView className="flex-1">
			{/* Header */}
			<View className="px-2 py-2 border-b border-gray-300">
				{/* Search Input */}
				<CustomSearchInput
					onPress={handleSearch}
					searching={isSearching}
					value={searchTerm}
					onChangeText={setSearchTerm}
					placeholder="Search conversations..."
				/>
			</View>

			{/* Chat List */}

			{isLoading ? (
				<Loading style={{ marginTop: 20 }} />
			) : (
				<FlatList
					data={filteredChats}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderChatItem}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={
						filteredChats.length === 0 ? { flex: 1 } : undefined
					}
					ListEmptyComponent={renderEmptyState}
					refreshControl={
						<RefreshControl
							refreshing={isLoading}
							onRefresh={fetchChats}
						/>
					}
				/>
			)}

			{/* Floating Action Button */}
			<TouchableOpacity
				style={{ backgroundColor: theme.color.primary }}
				className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
				onPress={() => {
					Alert.alert(
						"Comming soon",
						"This feature is comming very soon..."
					);
				}}
				activeOpacity={0.8}
			>
				<Text
					style={[
						styles.largeTextBold,
						{ color: theme.color.simple },
					]}
				>
					+
				</Text>
			</TouchableOpacity>
		</ThemedView>
	);
};

export default Chats;
