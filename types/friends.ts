export interface Friend {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	avatar?: string;
	isFriend?: boolean;
	requested?: boolean;
	requestedBy?: string;
	requestedAt?: string;
	friendSince?: Date;
}
// export interface FriendRequestType {
// 	id: string;
// 	email: string;
// 	avatar?: string;
// 	user_id: string;
// 	friend_id: string;
// 	created_at: Date;
// 	accepted: boolean;
// 	users: {
// 		id: string;
// 		first_name: string;
// 		last_name: string;
// 		email: string;
// 	};
// }
