import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { AppState } from "react-native";
const supabaseUrl =
	process.env.EXPO_PUBLIC_SUPABASE_URL ||
	"https://zuhgigmnnyluaouufaps.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey!, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
		lock: processLock,
	},
});

AppState.addEventListener("change", (nextAppState) => {
	if (nextAppState === "active") {
		supabase.auth.refreshSession();
	} else {
		supabase.auth.stopAutoRefresh();
	}
});
