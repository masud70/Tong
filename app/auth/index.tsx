// app/auth/index.tsx

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Loading from "@/components/LoadingIndicator";
import ThemedView from "@/components/ThemedView";
import { styles } from "@/constants/Constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function Index() {
	const { theme } = useTheme();
	const {
		email,
		setEmail,
		password,
		setPassword,
		showPassword,
		setShowPassword,
		isSignUp,
		setIsSignUp,
		confirmPassword,
		setConfirmPassword,
		isLoading,
		handleAuth,
	} = useAuth();

	// Animation values
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(50)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;
	const pulseAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		// Entrance animations
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
			}),
		]).start();

		// Logo pulse animation
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.1,
					duration: 2000,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 2000,
					useNativeDriver: true,
				}),
			])
		).start();
	}, []);

	const toggleAuthMode = () => {
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
		setIsSignUp(!isSignUp);
		setConfirmPassword("");
	};

	return (
		<ThemedView>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				className="flex-1 px-6"
			>
				{/* <GradientBackground> */}
				{/* Animated Background Elements */}
				<View className="absolute inset-0">
					<Animated.View
						className="absolute w-72 h-72 rounded-full opacity-10"
						style={{
							backgroundColor: "#4fd1c7",
							top: -100,
							right: -100,
							transform: [{ scale: pulseAnim }],
						}}
					/>
					<Animated.View
						className="absolute w-96 h-96 rounded-full opacity-5"
						style={{
							backgroundColor: "#f093fb",
							bottom: -150,
							left: -150,
							transform: [{ scale: pulseAnim }],
						}}
					/>
				</View>

				<Animated.View
					className="flex-1 justify-center"
					style={{
						opacity: fadeAnim,
						transform: [
							{ translateY: slideAnim },
							{ scale: scaleAnim },
						],
					}}
				>
					{/* Logo Section */}
					<View className="items-center mb-8">
						<Animated.View
							className="w-24 h-24 rounded-full mb-4 items-center justify-center overflow-hidden"
							style={{
								transform: [{ scale: pulseAnim }],
								backgroundColor: "rgba(79, 209, 199, 0.2)",
								borderWidth: 2,
								borderColor: "#4fd1c7",
							}}
						>
							<Image
								className="w-24 h-24 bg-red-500"
								source={require("@/assets/images/tong.png")}
							/>
						</Animated.View>

						<Text
							style={[
								styles.extraLargeText,
								{ color: theme.color.text },
							]}
							className="mb-2"
						>
							Tong
						</Text>
						<Text
							style={[
								styles.regularText,
								{ color: theme.color.subText },
							]}
							className="text-blue-200 text-base opacity-80"
						>
							Connect • Share • Express
						</Text>
					</View>

					{/* Signin or signup */}
					<View className="w-full items-center mb-4">
						<Text style={[styles.largeTextBold]}>
							{isSignUp ? "Sign Up" : "Sign In"}
						</Text>
					</View>

					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
					>
						{/* Input Fields */}
						<View
							style={[{ marginBottom: 30, marginTop: 30 }]}
							className="gap-2 bg-white/10 rounded-2xl border border-white/20"
						>
							<CustomInput
								placeholder="Enter your email"
								onChangeText={setEmail}
								value={email}
								keyboardType={"email-address"}
								autoComplete="email"
							/>
							<CustomInput
								placeholder="Enter your password"
								onChangeText={setPassword}
								value={password}
								autoComplete="password"
								secureTextEntry={!showPassword}
								onClickIcon={() => setShowPassword((p) => !p)}
								rightIcon={
									<Ionicons
										name={showPassword ? "eye-off" : "eye"}
										size={20}
									/>
								}
							/>
							{/* Confirm Password (Sign Up only) */}
							{isSignUp && (
								<CustomInput
									placeholder="Confirm your password"
									value={confirmPassword}
									onChangeText={setConfirmPassword}
									secureTextEntry={!showPassword}
									autoComplete="password"
								/>
							)}
						</View>

						<CustomButton
							backgroundColor="primary"
							text={
								isSignUp
									? isLoading
										? "Creating account..."
										: "Create Account"
									: isLoading
									? "Signing in..."
									: "Sign In"
							}
							onPress={handleAuth}
							disabled={isLoading}
							rightIcon={
								isLoading ? (
									<Loading size={22} color={"white"} />
								) : null
							}
						/>

						{/* Toggle Auth Mode */}
						<TouchableOpacity
							className="items-center py-4"
							onPress={toggleAuthMode}
						>
							<Text
								style={[
									styles.smallText,
									{ color: theme.color.text },
								]}
							>
								{isSignUp ? (
									<>
										Already have an account?{" "}
										<Text
											style={[
												styles.smallTextBold,
												{ color: theme.color.primary },
											]}
										>
											Sign In
										</Text>
									</>
								) : (
									<>
										Don&apos;t have an account?{" "}
										<Text
											style={[
												styles.smallTextBold,
												{ color: theme.color.primary },
											]}
										>
											Sign Up
										</Text>{" "}
										now.
									</>
								)}
							</Text>
						</TouchableOpacity>
					</KeyboardAvoidingView>

					{/* Footer */}
					<View className="items-center pb-8">
						<Text
							style={[styles.xsText, { width: "60%" }]}
							className="text-center"
						>
							By continuing, you agree to our Terms of Service and
							Privacy Policy
						</Text>
					</View>
				</Animated.View>
				{/* </GradientBackground> */}
			</ScrollView>
		</ThemedView>
	);
}
