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

export interface MessageType {
	id: number;
	chat_id: number;
	text: string;
	created_at: Date;
	media: string;
	user_id: string;
}
