import { supabase } from "@/lib/supabase";
import { ChatType } from "@/types/chats";
import { Message, MessagePayloadType } from "@/types/message";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useRoot } from "./useRoot";

export const useMessage = ({ chatId }: { chatId: number | null }) => {
	const [chat, setChat] = useState<ChatType>();
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState<string>("");
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [replyingTo, setReplyingTo] = useState<Message | null>(null);
	const { session } = useRoot();
	const router = useRouter();

	useEffect(() => {
		fetchMessages();
		fetchChat();
	}, []);

	useEffect(() => {
		if (!chatId) return;
		fetchMessages();
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
					const raw = payload.new as MessagePayloadType;
					console.log("New Message:", raw);

					if (raw.user_id === session?.user.id) {
						const newMessage: Message = {
							id: raw.id,
							text: raw.text,
							media: raw.media,
							timestamp: raw.created_at,
							senderId: raw.user_id,
							chat_id: raw.chat_id,
							status: "sent",
						};
						setMessages((pre) => [...pre, newMessage]);
					} else {
						const newMessage: Message = {
							id: raw.id,
							text: raw.text,
							media: raw.media,
							timestamp: raw.created_at,
							senderId: raw.user_id,
							chat_id: raw.chat_id,
							status: "read",
						};
						setMessages((pre) => [...pre, newMessage]);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId]);

	const sendMessage = async () => {
		try {
			const newMessage: Message = {
				id: 0,
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
			console.log("Sent Message");
		} catch (error) {
			console.log("Send Message Error:", error);
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

			const oldMessages = chat.data as MessagePayloadType[];

			const transformedMessages: Message[] = oldMessages.map((raw) => ({
				id: raw.id,
				text: raw.text,
				media: raw.media,
				timestamp: raw.created_at,
				senderId: raw.user_id,
				chat_id: raw.chat_id,
				status: "unread",
			}));
			setMessages(transformedMessages);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchChat = async () => {
		try {
			const { data, error } = await supabase
				.from("chats")
				.select(
					`*, chat_members ( *, users ( id, email, first_name, last_name))`
				)
				.eq("id", chatId);

			if (error) throw error;
			setChat(data[0] as ChatType);
			console.log("Chats:", data);
		} catch (error) {
			console.log("Fetch Chat Error:", error);
		}
	};

	const openNewChat = async (userIds: string[]) => {
		try {
			setIsLoading(true);
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data) {
				throw new Error("No user logged in!");
			}
			const newChat = await supabase
				.from("chats")
				.insert({ type: "personal" })
				.select("*");
			if (newChat.error) throw newChat.error;
			console.log("NewChat:", newChat.data);
			const members = await addMembers(newChat.data[0].id, [
				...userIds,
				currentUser.data.user?.id!,
			]);
			if (members.length > 0) {
				router.push({
					pathname: "/message/[chatId]",
					params: newChat.data[0].id,
				});
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
	};
};
