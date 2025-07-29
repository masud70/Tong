import GradientBackground from "@/components/GradientBackground";
import React, { useEffect, useRef, useState } from "react";
import {
	Alert,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TextInput,
	TextInputKeyPressEventData,
	TouchableOpacity,
	View,
} from "react-native";

type ContactMethod = "email" | "phone";

export default function TokenEntryPage() {
	const [token, setToken] = useState<string[]>(["", "", "", "", "", ""]);
	const [contactMethod, setContactMethod] = useState<ContactMethod>("email");
	const [contactValue, setContactValue] =
		useState<string>("user@example.com");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [resendTimer, setResendTimer] = useState<number>(0);

	const inputRefs = useRef<(TextInput | null)[]>([]);

	useEffect(() => {
		let interval: number | null = null;
		if (resendTimer > 0) {
			interval = setInterval(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [resendTimer]);

	const handleTokenChange = (value: string, index: number): void => {
		if (!/^\d*$/.test(value)) return;

		const newToken: string[] = [...token];
		newToken[index] = value;
		setToken(newToken);

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
		index: number
	): void => {
		// Handle backspace to go to previous input
		if (e.nativeEvent.key === "Backspace" && !token[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerifyToken = (): void => {
		const tokenString: string = token.join("");
		if (tokenString.length !== 6) {
			Alert.alert("Invalid Token", "Please enter all 6 digits");
			return;
		}

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			if (tokenString === "123456") {
				Alert.alert("Success", "Token verified successfully!");
			} else {
				Alert.alert(
					"Invalid Token",
					"Please check your token and try again"
				);
				// Clear token on error
				setToken(["", "", "", "", "", ""]);
				inputRefs.current[0]?.focus();
			}
		}, 1500);
	};

	const handleResendToken = (): void => {
		if (resendTimer > 0) return;

		setResendTimer(60); // 60 second cooldown
		Alert.alert(
			"Token Sent",
			`A new verification code has been sent to your ${contactMethod}`
		);
	};

	const handleContactMethodChange = (method: ContactMethod): void => {
		setContactMethod(method);
		setContactValue(
			method === "email" ? "user@example.com" : "+1 (555) 123-4567"
		);
		setToken(["", "", "", "", "", ""]);
		inputRefs.current[0]?.focus();
	};

	const isTokenComplete: boolean = token.every((digit) => digit !== "");

	return (
		<GradientBackground>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}
				className="flex-1"
			>
				<View className="flex-1 px-6 pt-16 pb-5">
					{/* Header */}
					<View className="items-center mb-8">
						<View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
							<Text className="text-blue-600 text-2xl font-bold">
								{contactMethod === "email" ? "📧" : "📱"}
							</Text>
						</View>
						<Text className="text-2xl font-bold text-white text-center mb-2">
							Verify Your{" "}
							{contactMethod === "email" ? "Email" : "Phone"}
						</Text>
						<Text className="text-gray-200 text-center leading-6">
							We&apos;ve sent a 6-digit verification code to
						</Text>
						<Text className="text-blue-300 font-semibold text-center mt-1">
							{contactValue}
						</Text>
					</View>

					{/* Token Input */}
					<View className="mb-8">
						<Text className="text-white font-medium mb-4 text-center">
							Enter verification code
						</Text>
						<View
							className="flex-row justify-center"
							style={{ gap: 12 }}
						>
							{token.map((digit: string, index: number) => (
								<TextInput
									key={index}
									ref={(ref: TextInput | null) => {
										inputRefs.current[index] = ref;
									}}
									className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg ${
										digit
											? "border-blue-500 bg-blue-50"
											: "border-gray-300 bg-white"
									} text-gray-900`}
									value={digit}
									onChangeText={(value: string) =>
										handleTokenChange(
											value.slice(-1),
											index
										)
									}
									onKeyPress={(
										e: NativeSyntheticEvent<TextInputKeyPressEventData>
									) => handleKeyPress(e, index)}
									keyboardType="numeric"
									maxLength={1}
									textContentType="oneTimeCode"
									autoComplete="sms-otp"
									selectTextOnFocus
								/>
							))}
						</View>
					</View>

					{/* Verify Button */}
					<TouchableOpacity
						className={`py-4 rounded-lg mb-6 ${
							isTokenComplete && !isLoading
								? "bg-blue-600"
								: "bg-gray-300"
						}`}
						onPress={handleVerifyToken}
						disabled={!isTokenComplete || isLoading}
						activeOpacity={0.8}
					>
						{isLoading ? (
							<View className="flex-row items-center justify-center">
								<Text className="text-white font-semibold text-lg mr-2">
									Verifying...
								</Text>
							</View>
						) : (
							<Text
								className={`text-center font-semibold text-lg ${
									isTokenComplete && !isLoading
										? "text-white"
										: "text-gray-500"
								}`}
							>
								Verify Code
							</Text>
						)}
					</TouchableOpacity>

					{/* Resend Section */}
					<View className="items-center mb-8">
						<Text className="text-white mb-3">
							Didn&apos;t receive the code?
						</Text>
						<TouchableOpacity
							onPress={handleResendToken}
							disabled={resendTimer > 0}
							className="py-2 px-4"
							activeOpacity={0.7}
						>
							<Text
								className={`font-semibold ${
									resendTimer > 0
										? "text-gray-200"
										: "text-blue-300"
								}`}
							>
								{resendTimer > 0
									? `Resend in ${resendTimer}s`
									: "Resend Code"}
							</Text>
						</TouchableOpacity>
					</View>

					{/* Contact Method Toggle */}
					<View className="border-t border-gray-200 pt-6">
						<Text className="text-gray-200 text-center mb-4">
							Need to use a different method?
						</Text>
						<View
							className="flex-row justify-center"
							style={{ gap: 16 }}
						>
							<TouchableOpacity
								className={`px-4 py-2 rounded-full border ${
									contactMethod === "email"
										? "border-blue-600 bg-blue-50"
										: "border-gray-300 bg-white"
								}`}
								onPress={() =>
									handleContactMethodChange("email")
								}
								activeOpacity={0.7}
							>
								<Text
									className={`font-medium ${
										contactMethod === "email"
											? "text-blue-600"
											: "text-gray-600"
									}`}
								>
									📧 Email
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								className={`px-4 py-2 rounded-full border ${
									contactMethod === "phone"
										? "border-blue-600 bg-blue-50"
										: "border-gray-300 bg-white"
								}`}
								onPress={() =>
									handleContactMethodChange("phone")
								}
								activeOpacity={0.7}
							>
								<Text
									className={`font-medium ${
										contactMethod === "phone"
											? "text-blue-600"
											: "text-gray-600"
									}`}
								>
									📱 Phone
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</GradientBackground>
	);
}
