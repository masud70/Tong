import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/zustand/stores";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useAuth = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const setSession = useAuthStore.use.setSession();
	const router = useRouter();

	const handleAuth = async () => {
		try {
			setIsLoading(true);
			if (isSignUp) {
				if (!email || !password || !confirmPassword) {
					Alert.alert("Error", "Please fill all fields");
					return;
				}
				if (password !== confirmPassword) {
					Alert.alert("Error", "Passwords do not match");
					return;
				}
				const { error } = await supabase.auth.signUp({
					email: email,
					password: password,
				});
				if (error) throw error;

				Alert.alert(
					"Email Verification",
					"Please check your inbox (and spam folder) for email verification!"
				);
				setIsSignUp(false);
				setConfirmPassword("");
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: email,
					password: password,
				});

				if (error) throw error;
				else {
					setSession(data.session);
					router.replace("/(tabs)");
					console.log("Login successful!", data);
				}
			}
		} catch (error: any) {
			console.info("Authentication error:", error);
			Alert.alert("Authentication Error", error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			else {
				setSession(null);
				console.log("Signout successful!");
				router.replace("/auth");
			}
		} catch (error) {
			console.error("Sign out error:", error);
			Alert.alert("Error", "Failed to sign out. Please try again.");
			return;
		}
	};

	return {
		email,
		setEmail,
		password,
		setPassword,
		isSignUp,
		setIsSignUp,
		confirmPassword,
		setConfirmPassword,
		isLoading,
		setIsLoading,
		showPassword,
		setShowPassword,
		handleAuth,
		handleSignOut,
	};
};
