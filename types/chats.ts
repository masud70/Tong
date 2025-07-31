export interface Chat {
	id: string;
	name: string;
	avatar?: string;
	lastMessage: string;
	timestamp: string;
	unreadCount: number;
	isOnline: boolean;
	isTyping?: boolean;
}

export interface ChatType {
	id: number;
	chat_title: string;
	created_at: Date;
	avatar?: string;
	isOnline?: boolean;
	lastMessage?: string;
	unreadCount?: number;
	type: "personal" | "group";
	chat_members: {
		id: string;
		first_name: string;
		last_name: string;
		email: string;
	}[];
}

export interface ChatsProps {
	navigation?: any;
}
