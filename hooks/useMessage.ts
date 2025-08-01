import { supabase } from "@/lib/supabase";
import { ChatType } from "@/types/chats";
import { Message, MessageType } from "@/types/message";
import { useAuthStore } from "@/zustand/stores";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useMessage = (chatId?: number | null) => {
	const [chat, setChat] = useState<ChatType>();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState<string>("");
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [replyingTo, setReplyingTo] = useState<Message | null>(null);
	const session = useAuthStore.use.session();
	const authUser = useAuthStore.use.authUser();
	const router = useRouter();

	useEffect(() => {
		if (!chatId) return;
		fetchMessages();
		fetchChat();
	}, [chatId]);

	useEffect(() => {
		if (!chatId) return;
		const channel = supabase
			.channel(`chat-messages-${chatId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
					filter: `chat_id=eq.${chat?.id}`,
				},
				(payload) => {
					const newMessage = payload.new as MessageType;
					if (payload.eventType === "INSERT") {
						console.log("New message inserted:", newMessage);
						if (newMessage.user_id !== session?.user.id)
							insertMessage(newMessage);
					} else if (payload.eventType === "DELETE") {
						setMessages((prev) =>
							prev.filter((msg) => msg.id !== newMessage.id)
						);
					} else if (payload.eventType === "UPDATE") {
						setMessages(
							(pre) =>
								pre.map((it) =>
									it.id === newMessage.id ? newMessage : it
								) as Message[]
						);
					}
				}
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId]);

	const insertMessage = (message: MessageType) => {
		try {
			const newMessage: Message = {
				id: message.id,
				text: message.text,
				media: message.media,
				timestamp: message.created_at,
				senderId: message.user_id,
				chat_id: message.chat_id,
				status:
					message.user_id === session?.user.id ? "sent" : "unread",
			};
			setMessages((pre) => [...pre, newMessage]);
		} catch (error) {
			console.log("Message insertion error:", error);
		}
	};

	const deleteMessage = async (messageId: number): Promise<void> => {
		try {
			const { error } = await supabase
				.from("messages")
				.delete()
				.eq("id", messageId)
				.eq("user_id", session?.user.id);

			if (error) throw error;
			else
				setMessages((prev) =>
					prev.filter((msg) => msg.id !== messageId)
				);
		} catch (error) {
			console.error("Delete message error:", error);
		}
	};

	const fetchMessages = async () => {
		try {
			setIsLoading(true);
			const chat = await supabase
				.from("messages")
				.select("*")
				.eq("chat_id", chatId);

			if (chat.error) throw chat.error;
			const oldMessages = chat.data as MessageType[];

			const transformedMessages: Message[] = oldMessages.map((raw) => ({
				id: raw.id,
				text: raw.text,
				media: raw.media,
				timestamp: raw.created_at,
				senderId: raw.user_id,
				chat_id: raw.chat_id,
				status: session?.user.id === raw.user_id ? "delivered" : "read",
			}));
			setMessages(transformedMessages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async () => {
		try {
			const messageId = Date.now();
			const newMessage: Message = {
				id: messageId,
				chat_id: chatId!,
				text: inputText,
				media: null,
				timestamp: new Date(),
				senderId: session?.user.id!,
				status: "sending",
			};
			setMessages((pre) => [...pre, newMessage]);
			setInputText("");

			const result = await supabase
				.from("messages")
				.insert([
					{
						chat_id: chatId,
						user_id: session?.user.id,
						text: newMessage.text,
					},
				])
				.select("*");
			if (result.error) throw result.error;
			setMessages((prev) =>
				prev.map((item) =>
					item.id === messageId
						? {
								...item,
								id: result.data[0].id,
								status: "delivered",
						  }
						: item
				)
			);
			console.log("Sent Message");
		} catch (error) {
			console.log("Send Message Error:", error);
		}
	};

	const fetchChat = async () => {
		try {
			const { data, error } = await supabase
				.from("chats")
				.select(
					`*, chat_members(*, user:users(id, email, display_name))`
				)
				.eq("id", chatId)
				.single();

			if (error) throw error;

			const transformedChatData: ChatType = {
				id: data.id,
				chat_title: data.chat_title,
				created_at: new Date(data.created_at),
				type: data.type,
				chat_members: data.chat_members.map((member: any) => ({
					id: member.user.id,
					email: member.user.email,
					displayName: member.user.display_name,
				})),
				// Optional fields can be added later if needed
				avatar: data.avatar,
				isOnline: undefined,
				lastMessage: undefined,
				unreadCount: 0,
			};
			setChat(transformedChatData);
		} catch (error) {
			console.log("Fetch Chat Error:", error);
		}
	};

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
				message.senderId === session?.user.id && {
					text: "Delete",
					style: "destructive",
					onPress: async () => await deleteMessage(message.id),
				},
				{ text: "Cancel", style: "cancel" },
			].filter(Boolean) as any
		);
	};

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

	const openNewChat = async (userIds: string[]) => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase.rpc("get_or_create_chat", {
				user_ids: [...userIds, authUser?.id],
			});
			if (error) throw error;
			else {
				console.log("New Chat:", data, error);
				router.push(`/message/${data}`);
			}
		} catch (error) {
			console.log("New Chat Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addMembers = async (chatId: number, userIds: string[]) => {
		try {
			console.log("User Ids:", userIds);
			const rows = userIds.map((id) => ({
				chat_id: chatId,
				user_id: id,
			}));
			const members = await supabase
				.from("chat_members")
				.insert(rows)
				.select("*");

			if (members.error) throw members.error;
			return members.data;
		} catch (error) {
			console.log("Add Members Error:", error);
			throw error;
		}
	};

	return {
		messages,
		setMessages,
		isLoading,
		chat,
		error,
		fetchMessages,
		inputText,
		setInputText,
		isTyping,
		setIsTyping,
		replyingTo,
		setReplyingTo,
		openNewChat,
		sendMessage,
		deleteMessage,
		getStatusIcon,
		addMembers,
		handleMessageLongPress,
	};
};
