// app/auth/index.tsx

import GradientBackground from "@/components/GradientBackground";
import { useAuth } from "@/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import Icon2 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function SignIn() {
	const {
		authMethod,
		setAuthMethod,
		email,
		setEmail,
		phone,
		setPhone,
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
		handleGoogleSignIn,
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
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
			className="flex-1"
		>
			<GradientBackground>
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
					className="flex-1 px-6 pt-20"
					style={{
						opacity: fadeAnim,
						transform: [
							{ translateY: slideAnim },
							{ scale: scaleAnim },
						],
					}}
				>
					{/* Logo Section */}
					<View className="items-center mb-12">
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

						<Text className="text-white text-4xl font-bold mb-2">
							Tong
						</Text>
						<Text className="text-blue-200 text-base opacity-80">
							Connect • Share • Express
						</Text>
					</View>

					{/* Auth Method Selector */}
					<View className="mb-8">
						<View className="flex-row bg-white/10 rounded-2xl p-1 mb-6">
							<TouchableOpacity
								className={`flex-1 py-3 rounded-xl items-center ${
									authMethod === "email" ? "bg-white/20" : ""
								}`}
								onPress={() => setAuthMethod("email")}
							>
								<View className="flex-row items-center">
									<Icon
										name="email"
										size={18}
										color={
											authMethod === "email"
												? "#4fd1c7"
												: "#94a3b8"
										}
									/>
									<Text
										className={`ml-2 font-semibold ${
											authMethod === "email"
												? "text-cyan-300"
												: "text-slate-400"
										}`}
									>
										Email
									</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								className={`flex-1 py-3 rounded-xl items-center ${
									authMethod === "phone" ? "bg-white/20" : ""
								}`}
								onPress={() => setAuthMethod("phone")}
							>
								<View className="flex-row items-center">
									<Icon
										name="phone"
										size={18}
										color={
											authMethod === "phone"
												? "#4fd1c7"
												: "#94a3b8"
										}
									/>
									<Text
										className={`ml-2 font-semibold ${
											authMethod === "phone"
												? "text-cyan-300"
												: "text-slate-400"
										}`}
									>
										Phone
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : undefined}
						keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
					>
						{/* Input Fields */}
						<View className="mb-8">
							{/* Email/Phone Input */}
							<View className="mb-4">
								<View className="bg-white/10 rounded-2xl border border-white/20">
									<TextInput
										className="px-4 py-4 text-white text-base"
										placeholder={
											authMethod === "email"
												? "Enter your email"
												: "Enter your phone number"
										}
										placeholderTextColor="#94a3b8"
										value={
											authMethod === "email"
												? email
												: phone
										}
										onChangeText={
											authMethod === "email"
												? setEmail
												: setPhone
										}
										keyboardType={
											authMethod === "email"
												? "email-address"
												: "phone-pad"
										}
										autoCapitalize="none"
										autoComplete={
											authMethod === "email"
												? "email"
												: "tel"
										}
									/>
								</View>
							</View>

							{/* Password Input */}
							<View className="mb-4">
								<View className="bg-white/10 rounded-2xl border border-white/20 flex-row items-center">
									<TextInput
										className="flex-1 px-4 py-4 text-white text-base"
										placeholder="Enter your password"
										placeholderTextColor="#94a3b8"
										value={password}
										onChangeText={setPassword}
										secureTextEntry={!showPassword}
										autoComplete="password"
									/>
									<TouchableOpacity
										className="px-4"
										onPress={() =>
											setShowPassword(!showPassword)
										}
									>
										<Icon
											name={
												showPassword
													? "visibility-off"
													: "visibility"
											}
											size={22}
											color="#94a3b8"
										/>
									</TouchableOpacity>
								</View>
							</View>

							{/* Confirm Password (Sign Up only) */}
							{isSignUp && (
								<View className="mb-4">
									<View className="bg-white/10 rounded-2xl border border-white/20">
										<TextInput
											className="px-4 py-4 text-white text-base"
											placeholder="Confirm your password"
											placeholderTextColor="#94a3b8"
											value={confirmPassword}
											onChangeText={setConfirmPassword}
											secureTextEntry={!showPassword}
											autoComplete="password"
										/>
									</View>
								</View>
							)}
						</View>

						{/* Auth Button */}
						<TouchableOpacity
							className="mb-4"
							onPress={handleAuth}
							disabled={isLoading}
						>
							<LinearGradient
								colors={
									isLoading
										? ["#64748b", "#475569"]
										: ["#4fd1c7", "#f093fb"]
								}
								className="py-4 rounded-2xl items-center"
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							>
								{isLoading ? (
									<View className="flex-row items-center">
										<View className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-3" />
										<Text className="text-white text-lg font-semibold">
											{isSignUp
												? "Creating Account..."
												: "Signing In..."}
										</Text>
									</View>
								) : (
									<Text className="text-white text-lg font-semibold">
										{isSignUp
											? "Create Account"
											: "Sign In"}
									</Text>
								)}
							</LinearGradient>
						</TouchableOpacity>

						{/* Divider */}
						<View className="flex-row items-center mb-4">
							<View className="flex-1 h-px bg-white/20" />
							<Text className="px-4 text-slate-400 text-sm">
								or
							</Text>
							<View className="flex-1 h-px bg-white/20" />
						</View>

						{/* Google Sign In */}
						<TouchableOpacity
							className="bg-white/10 border border-white/20 py-4 rounded-2xl items-center mb-6"
							onPress={handleGoogleSignIn}
						>
							<View className="flex-row items-center">
								<Icon2
									name="google"
									size={22}
									color="#4285F4"
								/>
								<Text className="ml-3 text-white text-base font-semibold">
									Continue with Google
								</Text>
							</View>
						</TouchableOpacity>

						{/* Toggle Auth Mode */}
						<TouchableOpacity
							className="items-center py-4"
							onPress={toggleAuthMode}
						>
							<Text className="text-blue-200">
								{isSignUp ? (
									<>
										Already have an account?{" "}
										<Text className="text-cyan-300 font-semibold">
											Sign In
										</Text>
									</>
								) : (
									<>
										Don&apos;t have an account?{" "}
										<Text className="text-cyan-300 font-semibold">
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
						<Text className="text-slate-500 text-xs text-center">
							By continuing, you agree to our Terms of Service and
							Privacy Policy
						</Text>
					</View>
				</Animated.View>
				{/* </KeyboardAvoidingView> */}
			</GradientBackground>
		</ScrollView>
	);
}
