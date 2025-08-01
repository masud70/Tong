import ProfileImage from "@/components/ProfileImage";
import ThemedView from "@/components/ThemedView";
import { Const, styles } from "@/constants/Constants";
import { useCommon } from "@/hooks/useCommon";
import { useMessage } from "@/hooks/useMessage";
import { useTheme } from "@/hooks/useTheme";
import { Message } from "@/types/message";
import { useAuthStore } from "@/zustand/stores";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
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

const ChatScreen = () => {
	const { chatId } = useLocalSearchParams();
	const router = useRouter();
	const session = useAuthStore.use.session();
	const { formatDate, formatTime } = useCommon();
	const { theme } = useTheme();
	const {
		chat,
		getTitle,
		messages,
		isTyping,
		inputText,
		setInputText,
		replyingTo,
		setReplyingTo,
		sendMessage,
		isLoading,
		getStatusIcon,
		handleMessageLongPress,
	} = useMessage({ chatId: parseInt(chatId as string) });

	const flatListRef = useRef<FlatList<Message>>(null);
	const inputRef = useRef<TextInput>(null);

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
							{chat?.avatar ? (
								<Image
									source={{ uri: chat?.avatar }}
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
									? "rounded-br-md"
									: "bg-gray-200 rounded-bl-md"
							}`}
							style={{
								backgroundColor: Const.color.primaryOpacity,
							}}
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
												: "text-white"
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
							<Text
								style={[styles.xsText]}
								className="text-gray-500 text-xs mr-1"
							>
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
		<ThemedView className="flex-1">
			{/* Header */}
			<View
				style={{ backgroundColor: theme.color.primary }}
				className="px-4 py-3 border-b border-gray-100 flex-row items-center"
			>
				<TouchableOpacity
					onPress={() => router.back()}
					className="px-2"
					hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
				>
					<FontAwesome5
						name="arrow-left"
						size={20}
						color={theme.color.simple}
					/>
				</TouchableOpacity>

				{/* User info */}
				<View className="flex-row items-center flex-1">
					<ProfileImage
						isGroup={chat?.type === "group"}
						className="mr-2"
					/>

					<View className="flex-1">
						<Text
							numberOfLines={1}
							style={[
								styles.smallTextBold,
								{ color: theme.color.simple },
							]}
						>
							{getTitle(chat)}
						</Text>
						<Text
							style={[
								styles.xsText,
								styles.subText,
								{ color: theme.color.simple },
							]}
						>
							{chat?.isOnline ? "Online" : "Last seen recently"}
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
						<FontAwesome5
							name="phone-alt"
							size={18}
							color={theme.color.simple}
						/>
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
						<FontAwesome5
							name="video"
							size={18}
							color={theme.color.simple}
						/>
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
					onContentSizeChange={() =>
						flatListRef.current?.scrollToEnd({ animated: true })
					}
				/>
			)}

			{/* Typing indicator */}
			{isTyping && (
				<View className="px-4 py-2 bg-gray-50">
					<View className="flex-row items-center">
						<View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-2">
							<Text className="text-gray-600 text-xs font-semibold">
								{getTitle(chat).charAt(0).toUpperCase()}
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
				keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			>
				<View className="bg-white border-t border-gray-100 px-4 py-2">
					<View className="flex-row items-center">
						{/* Attachment button */}
						<TouchableOpacity
							className="mr-1"
							onPress={() =>
								Alert.alert(
									"Comming soon",
									"This feature is comming very soon..."
								)
							}
						>
							<Ionicons
								name="add-circle-outline"
								size={30}
								color={theme.color.text}
							/>
						</TouchableOpacity>

						{/* Text input */}
						<View
							style={[
								{
									backgroundColor:
										theme.color.inputBackground,
								},
							]}
							className="flex-1  rounded-2xl px-3 py-1 mr-1"
						>
							<TextInput
								ref={inputRef}
								className="text-gray-900 text-base min-h-6"
								placeholder="Type a message..."
								placeholderTextColor="#9CA3AF"
								value={inputText}
								onChangeText={setInputText}
								multiline
								numberOfLines={2}
								textAlignVertical="center"
								onSubmitEditing={sendMessage}
								style={[styles.smallText]}
							/>
						</View>

						{/* Send button */}
						<TouchableOpacity
							onPress={
								inputText.trim()
									? sendMessage
									: () =>
											Alert.alert(
												"Comming soon",
												"This feature is comming very soon..."
											)
							}
							style={{
								backgroundColor: inputText.trim()
									? theme.color.primary
									: theme.color.inputBackground,
							}}
							className={`w-12 h-12 rounded-full items-center justify-center`}
						>
							{inputText.trim() ? (
								<FontAwesome
									name="send"
									size={22}
									color={theme.color.simple}
								/>
							) : (
								<Text className="text-white text-lg font-bold">
									🎤
								</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</ThemedView>
	);
};

export default ChatScreen;
