import { supabase } from "@/lib/supabase";
import { Friend, FriendRequestType } from "@/types/friends";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useFriend = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [myFriends, setMyFriends] = useState<Friend[]>([]);
	const [friendRequests, setFriendRequesteds] = useState<FriendRequestType[]>(
		[]
	);

	useEffect(() => {
		fetchFriendRequests();
		fetchMyFriends();
	}, []);

	const fetchMyFriends = useCallback(async () => {
		try {
			setIsLoading(true);
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data) {
				throw new Error("No user logged in!");
			}

			const { data: friends, error } = await supabase
				.from("friends")
				.select(
					`*, user:user_id (id, email, first_name, last_name), friend:friend_id (id, email, first_name, last_name)`
				)
				.eq("accepted", true)
				.or(
					`user_id.eq.${currentUser.data.user?.id},friend_id.eq.${currentUser.data.user?.id}`
				);

			if (friends) {
				const temp = friends.map((f) => {
					return f.user.id === currentUser.data.user?.id
						? {
								id: f.friend.id,
								email: f.friend.email,
								lastName: f.friend.last_name,
								firstName: f.friend.first_name,
                                isFriend: true,
						  }
						: {
								id: f.user.id,
								email: f.user.email,
								lastName: f.user.last_name,
								firstName: f.user.first_name,
                                isFriend: true,
						  };
				});
				setMyFriends(temp as Friend[]);
			}

			console.log("My Friends:", friends, error, myFriends);
		} catch (error) {
			console.log("Error fetching myFriends:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);
	const fetchFriendRequests = useCallback(async () => {
		try {
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data) {
				throw new Error("No user logged in!");
			}
			const result = await supabase
				.from("friends")
				.select(`*, users:friend_id(id, email, first_name, last_name)`)
				.match({
					friend_id: currentUser.data.user?.id,
					accepted: false,
				});
			if (result.error) throw result.error;
			else {
				setFriendRequesteds(result.data);
				console.log("Requests:", result.data);
			}
		} catch (error) {
			console.log("Error fetching friend requests:", error);
		}
	}, []);
	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("email", searchTerm);
			if (error) throw error;

			let friend = data[0] as Friend;

			if (data.length > 0) {
				const currentUser = await supabase.auth.getUser();
				const { error: friendStatusError, data: friendStatus } =
					await supabase
						.from("friends")
						.select("*")
						.or(
							`and(user_id.eq.${currentUser.data.user?.id},friend_id.eq.${friend.id}),and(user_id.eq.${friend.id},friend_id.eq.${currentUser.data.user?.id})`
						);

				if (friendStatusError) {
					console.error(
						"Error fetching friend status:",
						friendStatusError
					);
				} else if (friendStatus.length > 0) {
					friend.isFriend = friendStatus[0].accepted;
					friend.requested = true;
					friend.requestedBy = friendStatus[0].user_id;
					friend.requestedAt = friendStatus[0].created_at;
				}
				console.log("Friend Status:", friendStatus);
			}
			setFriends(data as Friend[]);
		} catch (error) {
			console.error("Error during search:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const sendFriendRequest = async (friendId: string) => {
		try {
			setIsLoading(true);
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data.user) {
				console.error("No user is logged in");
				return;
			}
			const result = await supabase
				.from("friends")
				.insert([
					{
						user_id: currentUser.data.user.id,
						friend_id: friendId,
						accepted: false,
					},
				])
				.select("*");

			if (result.data?.length) {
				const newFriends = friends.filter((friend) => {
					if (friend.id === friendId) {
						const newFriend: Friend = {
							...friend,
							requested: true,
							requestedBy: currentUser.data.user?.id,
							requestedAt: result.data[0].created_at,
						};
						return newFriend;
					} else {
						return friend;
					}
				});
				setFriends(newFriends);
			}
			if (result.error) throw result.error;
			else {
				console.log("Friend request sent successfully:", result.data);
				Alert.alert(
					"Friend Request Sent",
					"Your friend request has been sent successfully.",
					[{ text: "OK" }]
				);
			}
		} catch (error) {
			console.error("Error adding friend:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const acceptFriendRequest = async (userId: string) => {
		try {
			setIsLoading(true);
			const currentUser = await supabase.auth.getUser();
			if (!currentUser.data.user) {
				console.error("No user is logged in");
				return;
			}
			const result = await supabase
				.from("friends")
				.update({ accepted: true })
				.match({
					user_id: userId,
					friend_id: currentUser.data.user.id,
				})
				.select("*");

			if (result.error) throw result.error;
			else {
				console.log(
					"Friend request accepted successfully:",
					result.data,
					currentUser.data.user.id
				);
			}
			const newFriends = friends.map((friend) => {
				if (friend.id === userId) {
					return { ...friend, isFriend: true, requested: false };
				}
				return friend;
			});
			setFriends(newFriends);
		} catch (error) {
			console.error("Error accepting friend request:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const cancelFriendRequest = async (friendId: string) => {
		Alert.alert(
			"Cancel Friend Request",
			"Are you sure you want to cancel the friend request?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							setIsLoading(true);
							const currentUser = await supabase.auth.getUser();
							if (!currentUser.data.user) {
								console.error("No user is logged in");
								return;
							}
							const result = await supabase
								.from("friends")
								.delete()
								.match({
									user_id: currentUser.data.user.id,
									friend_id: friendId,
								})
								.select("*");

							if (result.error) throw result.error;
							else {
								console.log(
									"Friend request cancelled successfully:",
									result.data
								);
							}
							const newFriends = friends.filter(
								(friend) => friend.id !== friendId
							);
							setFriends(newFriends);
						} catch (error) {
							console.error(
								"Error cancelling friend request:",
								error
							);
						} finally {
							setIsLoading(false);
						}
					},
				},
			]
		);
	};

	return {
		searchTerm,
		setSearchTerm,
		handleSearch,
		isLoading,
		friends,
		myFriends,
		sendFriendRequest,
		acceptFriendRequest,
		cancelFriendRequest,
		friendRequests,
		fetchFriendRequests,
	};
};
