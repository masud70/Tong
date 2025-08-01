export interface Friend {
	id: string;
	email: string;
	phone: string | null;
	displayName: string;
	bio: string | null;
	avatar: string | null;
	createdAt: Date;
	isFriend?: boolean;
	requested?: boolean;
	requestedBy?: string;
	requestedAt?: string;
	friendsSince?: Date;
}
