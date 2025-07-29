export interface Message {
	id: number;
	chat_id: number;
	text: string;
	media: string | null;
	timestamp: Date;
	senderId: string;
	senderName?: string;
	status: "sending" | "sent" | "delivered" | "read" | "unread";
	replyTo?: number;
}

export interface MessagePayloadType {
	id: number;
	chat_id: number;
	text: string;
	created_at: Date;
	media: string;
	user_id: string;
}

export interface ChatUser {
	id: string;
	name: string;
	avatar?: string;
	isOnline: boolean;
	lastSeen?: Date;
}

export interface ChatScreenProps {
	route?: {
		params: {
			chatId: string;
			chatName: string;
			chatUser?: ChatUser;
		};
	};
	navigation?: any;
}
