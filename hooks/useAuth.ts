import { supabase } from "@/lib/supabase";
import { UserType } from "@/types/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useAuth = () => {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [authUser, setAuthUser] = useState<UserType>();
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const [authMethod, setAuthMethod] = useState<"email" | "phone" | "google">(
		"email"
	);

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				router.push("/");
			}
		});
	}, [router]);

	useEffect(() => {
		getAuthUser();
	}, []);

	const getAuthUser = async () => {
		try {
			const user = await supabase.auth.getUser();
			if (!user.data) {
				throw new Error("No user logged in!");
			}
			console.log(user);
			// setAuthUser(user);
		} catch (error) {
			console.log("Get Auth User Error:", error);
		}
	};

	const handleAuth = async () => {
		try {
			setIsLoading(true);
			if (isSignUp) {
				if (!email || !password || !confirmPassword) {
					Alert.alert("Error", "Please fill in all fields");
					return;
				}
				if (password !== confirmPassword) {
					Alert.alert("Error", "Passwords do not match");
					return;
				}
				const {
					data: { session },
					error,
				} = await supabase.auth.signUp({
					email: email,
					password: password,
				});
				if (error) throw error;

				if (!session)
					Alert.alert(
						"Please check your inbox for email verification!"
					);
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: email,
					password: password,
				});
				console.log("Sign in data:", data);
				if (error) throw error;
				else {
					router.push("/");
					Alert.alert("Success", "You are now logged in!");
				}
			}
		} catch (error) {
			console.info("Authentication error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = () => {
		Alert.alert(
			"Google Sign In",
			"Google authentication would be implemented here"
		);
	};

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Sign out error:", error);
			Alert.alert("Error", "Failed to sign out. Please try again.");
			return;
		}
	};

	return {
		authMethod,
		setAuthMethod,
		email,
		setEmail,
		phone,
		setPhone,
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
		handleGoogleSignIn,
		handleSignOut,
		getAuthUser,
	};
};
