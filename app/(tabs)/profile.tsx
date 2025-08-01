import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/zustand/stores";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const Profile = () => {
	const { handleSignOut } = useAuth();
	const { handleEditProfile, handleSettings } = useProfile();
	const session = useAuthStore.use.session();

	const profileStats = [
		{ label: "Posts", value: "24" },
		{ label: "Following", value: "186" },
		{ label: "Followers", value: "342" },
	];

	const menuItems = [
		{
			icon: "person-outline" as any,
			title: "Edit Profile",
			onPress: handleEditProfile,
		},
		{
			icon: "settings-outline" as any,
			title: "Settings",
			onPress: handleSettings,
		},
		{
			icon: "help-circle-outline" as any,
			title: "Help & Support",
			onPress: () => {},
		},
		{
			icon: "information-circle-outline" as any,
			title: "About",
			onPress: () => {},
		},
	];

	return (
		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
		>
			{/* Profile Section */}
			<View style={styles.profileSection}>
				<View style={styles.avatarContainer}>
					<View style={styles.avatar}>
						<Ionicons name="person" size={60} color="#FFFFFF" />
					</View>
					<TouchableOpacity style={styles.cameraButton}>
						<Ionicons name="camera" size={16} color="#FFFFFF" />
					</TouchableOpacity>
				</View>

				<Text style={styles.name}>
					{session?.user.email?.split("@")[0]}
				</Text>
				<Text style={styles.username}>{session?.user.email}</Text>
				<Text style={styles.bio}>
					Mobile Developer | React Native Enthusiast | Coffee Lover ☕
				</Text>

				{/* Stats */}
				<View style={styles.statsContainer}>
					{profileStats.map((stat, index) => (
						<View key={index} style={styles.statItem}>
							<Text style={styles.statValue}>{stat.value}</Text>
							<Text style={styles.statLabel}>{stat.label}</Text>
						</View>
					))}
				</View>

				{/* Action Buttons */}
				<View style={styles.actionButtons}>
					<TouchableOpacity
						style={styles.editButton}
						onPress={handleEditProfile}
					>
						<Ionicons
							name="create-outline"
							size={18}
							color="#23B82B"
						/>
						<Text style={styles.editButtonText}>Edit Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.shareButton}>
						<Ionicons
							name="share-outline"
							size={18}
							color="#6B7280"
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Menu Items */}
			<View style={styles.menuSection}>
				{menuItems.map((item, index) => (
					<TouchableOpacity
						key={index}
						style={styles.menuItem}
						onPress={item.onPress}
					>
						<View style={styles.menuItemLeft}>
							<Ionicons
								name={item.icon}
								size={24}
								color="#6B7280"
							/>
							<Text style={styles.menuItemText}>
								{item.title}
							</Text>
						</View>
						<Ionicons
							name="chevron-forward"
							size={20}
							color="#9CA3AF"
						/>
					</TouchableOpacity>
				))}
			</View>

			{/* Sign Out Button */}
			<View style={styles.signOutSection}>
				<TouchableOpacity
					style={styles.signOutButton}
					onPress={handleSignOut}
				>
					<Ionicons
						name="log-out-outline"
						size={20}
						color="#FFFFFF"
					/>
					<Text style={styles.signOutText}>Sign Out</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8FAFC",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#FFFFFF",
	},
	headerButton: {
		padding: 4,
	},
	profileSection: {
		backgroundColor: "#FFFFFF",
		paddingVertical: 30,
		paddingHorizontal: 20,
		alignItems: "center",
		marginBottom: 20,
	},
	avatarContainer: {
		position: "relative",
		marginBottom: 16,
	},
	avatar: {
		width: 120,
		height: 120,
		backgroundColor: "#23B82B",
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 4,
		borderColor: "#FFFFFF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	cameraButton: {
		position: "absolute",
		bottom: 5,
		right: 5,
		backgroundColor: "#23B82B",
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "#FFFFFF",
	},
	name: {
		fontSize: 24,
		color: "#1F2937",
		marginBottom: 4,
		fontFamily: "RobotoBold",
	},
	username: {
		fontSize: 16,
		color: "#6B7280",
		marginBottom: 12,
		fontFamily: "Roboto",
	},
	bio: {
		fontSize: 14,
		color: "#4B5563",
		textAlign: "center",
		lineHeight: 20,
		marginBottom: 24,
		paddingHorizontal: 20,
		fontFamily: "Roboto",
	},
	statsContainer: {
		flexDirection: "row",
		marginBottom: 24,
	},
	statItem: {
		alignItems: "center",
		marginHorizontal: 20,
	},
	statValue: {
		fontSize: 20,
		color: "#1F2937",
		fontFamily: "RobotoBold",
	},
	statLabel: {
		fontSize: 12,
		color: "#6B7280",
		marginTop: 2,
		fontFamily: "Roboto",
	},
	actionButtons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F3F4F6",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		gap: 8,
	},
	editButtonText: {
		fontSize: 14,
		color: "#23B82B",
		fontFamily: "RobotoBold",
	},
	shareButton: {
		backgroundColor: "#F3F4F6",
		width: 40,
		height: 40,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	menuSection: {
		backgroundColor: "#FFFFFF",
		marginBottom: 20,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	menuItemLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	menuItemText: {
		fontSize: 16,
		color: "#374151",
		fontWeight: "500",
		fontFamily: "Roboto",
	},
	signOutSection: {
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	signOutButton: {
		backgroundColor: "#DC2626CC",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 8,
		gap: 8,
	},
	signOutText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#FFFFFF",
		fontFamily: "Roboto",
	},
});

export default Profile;
