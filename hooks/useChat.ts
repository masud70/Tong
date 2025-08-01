import { supabase } from "@/lib/supabase";
import { ChatType } from "@/types/chats";
import { useAuthStore } from "@/zustand/stores";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useChat = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [chats, setChats] = useState<ChatType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const authUser = useAuthStore.use.authUser();
	const router = useRouter();

	useEffect(() => {
		fetchChats();
	}, []);

	const fetchChats = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("chat_members")
				.select(
					`chat:chats(id, chat_title, created_at, type, avatar, chat_members(user:users(id, email, display_name)))`
				)
				.eq("user_id", authUser?.id);

			const transformedChats: ChatType[] = (data ?? ([] as any)).map(
				(item: any) => {
					const chat = item.chat;
					return {
						id: chat.id,
						chat_title: chat.chat_title,
						created_at: new Date(chat.created_at),
						type: chat.type,
						chat_members: chat.chat_members.map((member: any) => ({
							id: member.user.id,
							email: member.user.email,
							displayName: member.user.display_name,
						})),
						avatar: chat.avatar,
						isOnline: undefined,
						lastMessage: undefined,
						unreadCount: 0,
					};
				}
			);
			if (error) throw error;
			setChats(transformedChats);
		} catch (error) {
			console.log("Fetch Chat Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = () => {
		setIsSearching(true);
		setTimeout(() => setIsSearching(false), 2000);
	};

	const handleChatPress = (chatId: number) => {
		try {
			console.log(`Navigating to chat with ID: ${chatId}`);
			router.push(`./message/${chatId}`);
		} catch (error) {
			console.error("Error navigating to chat:", error);
			return;
		}
	};

	return {
		searchTerm,
		setSearchTerm,
		chats,
		setChats,
		fetchChats,
		handleSearch,
		isLoading,
		isSearching,
		handleChatPress,
	};
};
