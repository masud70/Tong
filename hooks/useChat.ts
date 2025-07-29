import { supabase } from "@/lib/supabase";
import { ChatType } from "@/types/chats";
import { useEffect, useState } from "react";

export const useChat = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [chats, setChats] = useState<ChatType[]>([]);

	useEffect(() => {
		fetchChats();
	}, []);

	const fetchChats = async () => {
		try {
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data) {
				throw new Error("No user logged in!");
			}
			const chats = await supabase
				.from("chats")
				.select("*, chat_members(user_id)");
			if (chats.error) throw chats.error;
			setChats(chats.data);
			console.log("Chats:", chats.data);
		} catch (error) {
			console.log("Fetch Chat Error:", error);
		}
	};

	return { searchTerm, setSearchTerm, chats, setChats };
};
