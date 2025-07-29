import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useRoot = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const router = useRouter();

	useEffect(() => {
		init();
	}, []);

	const init = async () => {
		try {
			setIsLoading(true);
			supabase.auth.getSession().then(({ data: { session } }) => {
				setSession(session);
			});
			supabase.auth.onAuthStateChange((_event, session) => {
				console.log("Auth state changed:", _event);
				setSession(session);
				if (!session) {
					console.log("No session found, redirecting to auth");
					router.push("/auth");
					setIsLoggedIn(false);
				}
			});
		} catch (error) {
			console.info("Initialization error:", error);
		} finally {
			setIsLoading(false);
			console.log("Root initialized with session:", session);
		}
	};

	return {
		isLoggedIn,
		setIsLoggedIn,
		isLoading,
		setIsLoading,
		session,
		setSession,
	};
};
