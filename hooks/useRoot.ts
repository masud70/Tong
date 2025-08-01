import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/zustand/stores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useRoot = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const setAuthSession = useAuthStore.use.setSession();
	const router = useRouter();

	useEffect(() => {
		console.log("App initialized:", isInitialized);
		if (!isInitialized) initialization();
		// Listen to session changes
		supabase.auth.onAuthStateChange((_event, session) => {
			console.log("Auth state changed:", _event);
			setAuthSession(session);
			if (!session) {
				console.log("No session found, redirecting to auth");
				router.replace("/auth");
			}
		});
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
					setAuthSession(session);
					router.replace(session ? "/(tabs)/profile" : "/auth");
				});
			}
		} catch (error) {
			console.info("Initialization error:", error);
		} finally {
			setTimeout(() => {
				console.log("App initialized!");
				setIsLoading(false);
				setIsInitialized(true);
			}, 2000);
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
		isLoading,
	};
};
