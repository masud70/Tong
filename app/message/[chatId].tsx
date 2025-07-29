import { useCommon } from "@/hooks/useCommon";
import { useMessage } from "@/hooks/useMessage";
import { useRoot } from "@/hooks/useRoot";
import { ChatScreenProps, ChatUser, Message } from "@/types/message";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const currentUserId = "current-user";

const mockChatUser: ChatUser = {
	id: "other-user",
	name: "Alice Johnson",
	avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e59d01?w=100&h=100&fit=crop&crop=face",
	isOnline: true,
	lastSeen: new Date(),
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
	const { chatId } = useLocalSearchParams();
	const router = useRouter();
	const { session } = useRoot();
	const { formatDate, formatTime } = useCommon();
	const {
		messages,
		setMessages,
		isTyping,
		inputText,
		setInputText,
		replyingTo,
		setReplyingTo,
		sendMessage,
		isLoading,
	} = useMessage({ chatId: parseInt(chatId as string) });

	const flatListRef = useRef<FlatList<Message>>(null);
	const inputRef = useRef<TextInput>(null);
	const chatUser = route?.params?.chatUser || mockChatUser;
	const chatName = session?.user.email?.split("@")[0];

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messages.length > 0) {
			setTimeout(() => {
				flatListRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages]);

	// Handle long press on message
	const handleMessageLongPress = (message: Message): void => {
		Alert.alert(
			"Message Options",
			"",
			[
				{ text: "Reply", onPress: () => setReplyingTo(message) },
				{
					text: "Copy",
					onPress: () => console.log("Copy:", message.text),
				},
				message.senderId === currentUserId && {
					text: "Delete",
					style: "destructive",
					onPress: () => deleteMessage(message.id),
				},
				{ text: "Cancel", style: "cancel" },
			].filter(Boolean) as any
		);
	};

	// Delete message
	const deleteMessage = (messageId: number): void => {
		setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
	};

	// Get message status icon
	const getStatusIcon = (status: Message["status"]): string => {
		switch (status) {
			case "sending":
				return "🕐";
			case "sent":
				return "✓";
			case "delivered":
				return "✓✓";
			case "read":
				return "✓✓";
			default:
				return "";
		}
	};

	// Render date separator
	const renderDateSeparator = (date: Date) => (
		<View className="items-center my-4">
			<View className="bg-gray-200 px-3 py-1 rounded-full">
				<Text className="text-gray-600 text-xs font-medium">
					{formatDate(date)}
				</Text>
			</View>
		</View>
	);

	// Render message item
	const renderMessage = ({
		item,
		index,
	}: {
		item: Message;
		index: number;
	}) => {
		const isOwnMessage = item.senderId === session?.user.id;
		const showDateSeparator =
			index === 0 ||
			formatDate(item.timestamp) !==
				formatDate(messages[index - 1]?.timestamp);

		const repliedMessage = item.replyTo
			? messages.find((msg) => msg.id === item.replyTo)
			: null;

		return (
			<View>
				{showDateSeparator && renderDateSeparator(item.timestamp)}

				<View
					className={`flex-row mb-2 px-4 ${
						isOwnMessage ? "justify-end" : "justify-start"
					}`}
				>
					{/* Other user avatar */}
					{!isOwnMessage && (
						<View className="mr-2">
							{chatUser.avatar ? (
								<Image
									source={{ uri: chatUser.avatar }}
									className="w-8 h-8 rounded-full"
								/>
							) : (
								<View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
									<Text className="text-gray-600 text-xs font-semibold">
										{session?.user.email
											?.charAt(0)
											.toUpperCase()}
									</Text>
								</View>
							)}
						</View>
					)}

					{/* Message bubble */}
					<TouchableOpacity
						onLongPress={() => handleMessageLongPress(item)}
						className={`max-w-[80%] ${
							isOwnMessage ? "ml-auto" : "mr-auto"
						}`}
						activeOpacity={0.8}
					>
						<View
							className={`px-4 py-3 rounded-2xl ${
								isOwnMessage
									? "bg-blue-600 rounded-br-md"
									: "bg-gray-200 rounded-bl-md"
							}`}
						>
							{/* Reply preview */}
							{repliedMessage && (
								<View
									className={`border-l-4 pl-3 mb-2 ${
										isOwnMessage
											? "border-blue-300"
											: "border-gray-400"
									}`}
								>
									<Text
										className={`text-xs font-medium ${
											isOwnMessage
												? "text-blue-200"
												: "text-gray-600"
										}`}
									>
										{repliedMessage.senderName}
									</Text>
									<Text
										className={`text-sm ${
											isOwnMessage
												? "text-blue-100"
												: "text-gray-500"
										}`}
										numberOfLines={2}
									>
										{repliedMessage.text}
									</Text>
								</View>
							)}

							{/* Message text */}
							<Text
								className={`text-base ${
									isOwnMessage
										? "text-white"
										: "text-gray-900"
								}`}
							>
								{item.text}
							</Text>
						</View>

						{/* Message info */}
						<View
							className={`flex-row items-center mt-1 ${
								isOwnMessage ? "justify-end" : "justify-start"
							}`}
						>
							<Text className="text-gray-500 text-xs mr-1">
								{formatTime(item.timestamp)}
							</Text>
							{isOwnMessage && (
								<Text
									className={`text-xs ${
										item.status === "read"
											? "text-blue-600"
											: "text-gray-500"
									}`}
								>
									{getStatusIcon(item.status)}
								</Text>
							)}
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View className="flex-1 bg-white">
			{/* Header */}
			<View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center">
				<TouchableOpacity
					onPress={() => router.back()}
					className="p-1"
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<Text className="text-blue-600 text-2xl font-bold">←</Text>
				</TouchableOpacity>

				{/* User info */}
				<View className="flex-row items-center flex-1">
					<Image
						source={
							!chatUser.avatar
								? { uri: chatUser.avatar }
								: require("@/assets/images/tong.png")
						}
						className="w-10 h-10 rounded-full mr-3"
					/>

					<View className="flex-1">
						<Text
							className="text-gray-900 font-semibold text-base"
							numberOfLines={1}
						>
							{chatName}
						</Text>
						<Text className="text-gray-500 text-sm">
							{chatUser.isOnline
								? "Online"
								: "Last seen recently"}
						</Text>
					</View>
				</View>

				{/* Header actions */}
				<View className="flex-row">
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								"Comming soon",
								"This feature will be added very soon..."
							);
						}}
						className="p-2 mr-1"
					>
						<Text className="text-gray-600 text-lg">📞</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							Alert.alert(
								"Comming soon",
								"This feature will be added very soon..."
							);
						}}
						className="p-2"
					>
						<Text className="text-gray-600 text-lg">📹</Text>
					</TouchableOpacity>
				</View>
			</View>

			{isLoading ? (
				<ActivityIndicator
					size={36}
					animating={isLoading}
					className="flex-1 bg-gray-50"
				/>
			) : (
				<FlatList
					ref={flatListRef}
					data={messages}
					keyExtractor={(_item, index) => index.toString()}
					renderItem={renderMessage}
					showsVerticalScrollIndicator={false}
					className="flex-1 bg-gray-50"
					contentContainerStyle={{ paddingVertical: 8 }}
				/>
			)}

			{/* Typing indicator */}
			{isTyping && (
				<View className="px-4 py-2 bg-gray-50">
					<View className="flex-row items-center">
						<View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-2">
							<Text className="text-gray-600 text-xs font-semibold">
								{chatUser.name.charAt(0).toUpperCase()}
							</Text>
						</View>
						<View className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-md">
							<Text className="text-gray-600 text-sm italic">
								typing...
							</Text>
						</View>
					</View>
				</View>
			)}

			{/* Reply preview */}
			{replyingTo && (
				<View className="bg-blue-50 border-t border-blue-200 px-4 py-3">
					<View className="flex-row items-center justify-between">
						<View className="flex-1 border-l-4 border-blue-600 pl-3">
							<Text className="text-blue-600 font-medium text-sm">
								Replying to {replyingTo.senderName}
							</Text>
							<Text
								className="text-gray-600 text-sm"
								numberOfLines={1}
							>
								{replyingTo.text}
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => setReplyingTo(null)}
							className="ml-3 p-1"
						>
							<Text className="text-gray-500 text-lg">✕</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Input area */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<View className="bg-white border-t border-gray-100 px-4 py-2">
					<View className="flex-row items-center">
						{/* Attachment button */}
						<TouchableOpacity className="p-2">
							<Text className="text-gray-500 text-xl">📎</Text>
						</TouchableOpacity>

						{/* Text input */}
						<View className="flex-1 max-h-24 bg-gray-100 rounded-2xl px-3 py-1 mr-2">
							<TextInput
								ref={inputRef}
								className="text-gray-900 text-base min-h-6"
								placeholder="Type a message..."
								placeholderTextColor="#9CA3AF"
								value={inputText}
								onChangeText={setInputText}
								multiline
								textAlignVertical="center"
								onSubmitEditing={sendMessage}
							/>
						</View>

						{/* Send button */}
						<TouchableOpacity
							onPress={sendMessage}
							className={`w-10 h-10 rounded-full items-center justify-center ${
								inputText.trim() ? "bg-blue-600" : "bg-gray-300"
							}`}
							disabled={!inputText.trim()}
						>
							<Text className="text-white text-lg font-bold">
								{inputText.trim() ? "→" : "🎤"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default ChatScreen;
