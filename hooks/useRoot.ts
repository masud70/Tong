import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/zustand/stores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useRoot = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [session, setSession] = useState<Session | null>(null);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const router = useRouter();
	const setAuthSession = useAuthStore.use.setSession();
	// const isInitialized = useAuthStore.use.isInitialized();
	// const setIsInitialized = useAuthStore.use.setIsInitialized();

	useEffect(() => {
		console.log("App initialized:", isInitialized);
		if (!isInitialized) initialization();
		else {
			// Listen to session changes
			supabase.auth.onAuthStateChange((_event, session) => {
				console.log("Auth state changed:", _event);
				// setSession(session);
				setAuthSession(session);
				if (!session) {
					console.log("No session found, redirecting to auth");
					router.replace("/auth");
				}
			});
		}
	}, [isInitialized]);

	const initialization = async () => {
		try {
			setIsLoading(true);
			const isFirst = await checkAppState();
			if (isFirst) {
				setTimeout(async () => {
					console.log("Thank you for choosing Tong messaging app!");
					router.replace("/splash/second");
					await AsyncStorage.setItem("hasLaunchedBefore", "true");
				}, 3000);
			} else {
				console.log("Welcome back to our Tong message app!");
				supabase.auth.getSession().then(({ data: { session } }) => {
					// setSession(session);
					setAuthSession(session);
					if (session) {
						router.replace("/(tabs)");
					} else {
						router.replace("/auth");
					}
				});
			}
		} catch (error) {
			console.info("Initialization error:", error);
		} finally {
			setTimeout(() => {
				console.log("App initialized!");
				setIsLoading(false);
				setIsInitialized(true);
			}, 3000);
		}
	};

	const checkAppState = async (): Promise<boolean> => {
		try {
			const launched = await AsyncStorage.getItem("hasLaunchedBefore");
			return launched === null;
		} catch (error) {
			throw error;
		}
	};

	return {
		isLoggedIn,
		setIsLoggedIn,
		isLoading,
		setIsLoading,
	};
};
