import CustomButton from "@/components/CustomButton";
import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const Second = () => {
	const { theme } = useTheme();
	const router = useRouter();

	const onPressSkip = () => {
		console.log("Skipped splash screen!");
		router.replace("/auth");
	};

	return (
		<ThemedView>
			<View
				className="flex h-full flex-col items-center justify-center"
				style={{ paddingTop: 150 }}
			>
				<View className="w-full flex flex-row justify-between">
					<Image
						source={require("@/assets/images/tong.png")}
						style={{ width: 50, height: 50, top: -40, left: 20 }}
						className="rounded-full"
					/>
					<Image
						source={require("@/assets/images/tong.png")}
						style={{ width: 80, height: 80, bottom: 150 }}
						className="rounded-full"
					/>
					<Image
						source={require("@/assets/images/tong.png")}
						style={{ width: 110, height: 110, bottom: 240 }}
						className="rounded-full"
					/>
					<Image
						source={require("@/assets/images/tong.png")}
						style={{ width: 60, height: 60, left: 20, bottom: 170 }}
						className="rounded-full"
					/>
					<Image
						source={require("@/assets/images/tong.png")}
						style={{
							width: 70,
							height: 70,
							right: 140,
							bottom: 50,
						}}
						className="rounded-full"
					/>
					<Image
						source={require("@/assets/images/tong.png")}
						style={{ width: 90, height: 90, bottom: 50, right: 70 }}
						className="rounded-full"
					/>
				</View>
				<Text
					style={[
						styles.largeTextBold,
						{
							color: theme.color.primary,
							marginBottom: 50,
							width: "70%",
							textAlign: "center",
						},
					]}
				>
					Welcome to our Tong messaging app
				</Text>
				<CustomButton
					text="Skip"
					size={"medium"}
					onPress={onPressSkip}
					rightIcon={
						<Ionicons
							color={"#fff"}
							name="arrow-forward-circle-sharp"
							size={20}
						/>
					}
				/>
			</View>
		</ThemedView>
	);
};

export default Second;
