import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.color.tint,
				headerShown: true,
				headerStyle: {
					height: 50,
					backgroundColor: theme.color.primary,
				},
				headerTitleStyle: {
					fontSize: 25,
					color: theme.color.tint,
                    fontFamily: 'RobotoBold'
				},
				headerTitleAlign: "center",
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: {
					backgroundColor: theme.color.TabBarBackgroundColor,
					borderTopWidth: 0,
					height: 55,
					paddingBottom: Platform.OS === "ios" ? 10 : 0,
				},
				tabBarLabelStyle: {
					fontSize: 14,
                    fontFamily: 'RobotoSemiBold',
					color: theme.color.text,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Chats",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="chats" focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="stories"
				options={{
					title: "Stories",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="stories" focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="friends"
				options={{
					title: "Friends",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="friends" focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="profile" focused={focused} />
					),
				}}
			/>
		</Tabs>
	);
}

// TabIcon component to render icons for each tab
type TabName = "chats" | "friends" | "profile" | "stories";
type TabIconProps = {
	name: TabName;
	focused: boolean;
};

export const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {
	const { theme } = useTheme();

	const IconMap: Record<TabName, keyof typeof Ionicons.glyphMap> = {
		chats: "chatbox-ellipses",
		friends: "people",
		profile: "person",
		stories: "camera",
	};

	return (
		<IconSymbol
			size={28}
			name={IconMap[name]}
			color={
				focused
					? theme.color.tabIconSelected
					: theme.color.tabIconDefault
			}
		/>
	);
};
