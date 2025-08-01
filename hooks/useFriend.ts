import { supabase } from "@/lib/supabase";
import { Friend } from "@/types/friends";
import { useAuthStore } from "@/zustand/stores";
import { showAlert } from "@/zustand/util/alert";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export const useFriend = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [myFriends, setMyFriends] = useState<Friend[]>([]);
	const authUser = useAuthStore.use.authUser();
	const [friendRequests, setFriendRequests] = useState<Friend[]>([]);

	useEffect(() => {
		fetchFriendRequests();
		fetchMyFriends();
	}, []);

	useEffect(() => {
		if (!searchTerm.trim()) {
			setFriends([]);
		}
	}, [searchTerm]);

	const fetchMyFriends = async () => {
		try {
			setIsLoading(true);
			const { data: friendships, error: friendsError } = await supabase
				.from("friends")
				.select("user_id, friend_id")
				.or(`user_id.eq.${authUser?.id},friend_id.eq.${authUser?.id}`)
				.eq("accepted", true);

			if (friendsError) throw friendsError;

			if (!friendships?.length) return [];

			const friendIds = friendships.map((f) =>
				f.user_id === authUser?.id ? f.friend_id : f.user_id
			);

			const { data: friends, error: usersError } = await supabase
				.from("users")
				.select("*")
				.in("id", friendIds);

			if (usersError) throw usersError;

			const searchedFriends = friends.map((f) => ({
				id: f.id,
				email: f.email,
				phone: f.phone,
				bio: f.bio,
				avatar: f.avatar,
				displayName: f.display_name,
				createdAt: f.created_at,
				isFriend: true,
				friendsSince: new Date(),
			})) as Friend[];

			setMyFriends(searchedFriends);
		} catch (error) {
			console.log("Error fetching myFriends:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const fetchFriendRequests = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data: requesters, error: requestError } = await supabase
				.from("friends")
				.select("user_id")
				.eq("friend_id", authUser?.id)
				.eq("accepted", false);

			if (requestError) throw requestError;

			if (!requesters?.length) return [];

			const requesterIds = requesters.map((f) => f.user_id);

			const { data: requests, error: usersError } = await supabase
				.from("users")
				.select("*")
				.in("id", requesterIds);

			if (usersError) throw usersError;

			setFriendRequests(
				requests.map((f) => ({
					id: f.id,
					email: f.email,
					phone: f.phone,
					bio: f.bio,
					avatar: f.avatar,
					displayName: f.display_name,
					createdAt: f.created_at,
					isFriend: false,
				})) as Friend[]
			);
		} catch (error) {
			console.log("Error fetching friend requests:", error);
		}
	}, [friendRequests]);
	const searchFriends = async () => {
		try {
			setIsSearching(true);
			const { data, error } = await supabase.rpc("search_friends", {
				current_user_id: authUser?.id,
				search_term: searchTerm,
			});
			if (error) throw error;

			const searchedFriends = data.map((f: any) => ({
				id: f.id,
				email: f.email,
				phone: f.phone,
				bio: f.bio,
				avatar: f.avatar,
				displayName: f.display_name,
				createdAt: f.created_at,
				isFriend: f.is_friend,
				friendsSince: f.friends_since,
			})) as Friend[];

			setFriends(searchedFriends);
		} catch (error) {
			console.log("Search friend error:", error);
		} finally {
			setIsSearching(false);
		}
	};
	const sendFriendRequest = async (friendId: string) => {
		try {
			setIsLoading(true);
			const { data: exist, error: existError } = await supabase
				.from("friends")
				.select("*")
				.match({ user_id: authUser?.id, friend_id: friendId });
			if (existError) {
				throw existError;
			} else if (exist.length > 0) {
				showAlert(
					"Request Already Sent",
					"You have sent a friend request already."
				);
				return;
			}

			const { data, error } = await supabase
				.from("friends")
				.insert([
					{
						user_id: authUser?.id,
						friend_id: friendId,
						accepted: false,
					},
				])
				.select("*")
				.single();

			if (error) throw error;

			console.log("Friend req data:", data);

			if (data) {
				setFriends(
					(pre) =>
						pre.map((f) =>
							f.id === data.user_id
								? {
										...f,
										requested: true,
										friendsSince: data.created_at,
										isFriend: false,
										requestedBy: authUser?.id,
										requestedAt: data.created_at,
								  }
								: f
						) as Friend[]
				);
				showAlert(
					"Successful!!!",
					"Your friend request has been sent successfully."
				);
			} else {
				throw new Error("There was an error.");
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
			const result = await supabase
				.from("friends")
				.update({ accepted: true })
				.match({
					user_id: userId,
					friend_id: authUser?.id,
				})
				.select("*");

			if (result.error) throw result.error;
			else {
				console.log("Friend request accepted:", result.data);
				setFriendRequests(
					(pre) =>
						pre.map((f) =>
							f.id === userId
								? { ...f, isFriend: true, requested: false }
								: f
						) as Friend[]
				);
				setFriends(
					(pre) =>
						pre.map((f) =>
							f.id === userId
								? { ...f, isFriend: true, requested: false }
								: f
						) as Friend[]
				);
			}
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
							const result = await supabase
								.from("friends")
								.delete()
								.match({
									user_id: authUser?.id,
									friend_id: friendId,
								})
								.select("*");

							if (result.error) throw result.error;
							else {
								setFriends(
									(pre) =>
										pre.map((f) => ({
											...f,
											friendsSince:
												f.id === friendId
													? null
													: f.friendsSince,
										})) as Friend[]
								);
								console.log(
									"Friend request cancelled successfully:",
									result.data
								);
							}
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
		isLoading,
		friends,
		myFriends,
		isSearching,
		sendFriendRequest,
		acceptFriendRequest,
		cancelFriendRequest,
		friendRequests,
		searchFriends,
		fetchFriendRequests,
		fetchMyFriends,
	};
};
